// @ts-nocheck
import { NextResponse } from 'next/server'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'
import { MODULE_CONFIG, getUnlockedProfileCount } from '@/lib/constants'
import { mapModuleAnswers, getDimensionsForModule } from '@/lib/assessment/answer-mapper'
import { computeDimensionScores } from '@/lib/scoring/cis-engine'
import type { DimensionId, DimensionScore } from '@/lib/scoring/types'

export async function POST(request: Request) {
  try {
    // ── 1. Authenticate ──
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── 2. Parse & validate request body ──
    const body = await request.json()
    const { module, answers } = body as { module: number; answers: Record<string, number> }

    if (!module || module < 1 || module > 6) {
      return NextResponse.json({ error: 'Invalid module' }, { status: 400 })
    }

    const expectedCount = MODULE_CONFIG[module - 1]?.questionCount
    if (!expectedCount || Object.keys(answers).length !== expectedCount) {
      return NextResponse.json({ error: 'Incomplete answers' }, { status: 400 })
    }

    // ── 3. Store raw answers ──
    const serviceClient = await getSupabaseServiceClient()
    if (!serviceClient) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const responsePayload = JSON.stringify(answers)
    const encoder = new TextEncoder()
    const responseBytes = encoder.encode(responsePayload)

    // Integrity hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', responseBytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const responseHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Upsert raw assessment responses
    const { error: insertError } = await serviceClient
      .from('assessment_responses')
      .upsert({
        user_id: user.id,
        module,
        encrypted_responses: responsePayload,
        response_hash: responseHash,
        submitted_at: new Date().toISOString(),
      } as never, {
        onConflict: 'user_id,module',
      })

    if (insertError) {
      console.error('Assessment insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save responses' }, { status: 500 })
    }

    // ── 4. Map answers to scoring-engine format and compute dimension scores ──
    const mappedAnswers = mapModuleAnswers(answers)
    const dimensionsForModule = getDimensionsForModule(module)
    const computedScores: DimensionScore[] = []

    for (const dimId of dimensionsForModule) {
      try {
        const dimScore = computeDimensionScores(dimId, mappedAnswers)
        computedScores.push(dimScore)

        // Store dimension score in database
        await serviceClient
          .from('dimension_scores')
          .upsert({
            user_id: user.id,
            dimension_id: dimId,
            module,
            overall_score: dimScore.overallScore,
            sub_scale_scores: dimScore.subScaleScores,
            attachment_style: dimScore.attachmentStyle ?? null,
            conflict_approach: dimScore.conflictApproach ?? null,
            love_lang_profile: dimScore.loveLangProfile ?? null,
            profile_vector: dimScore.profileVector ?? null,
            computed_at: new Date().toISOString(),
          } as never, {
            onConflict: 'user_id,dimension_id',
          })
      } catch (scoreErr) {
        console.error(`Scoring error for dimension ${dimId}:`, scoreErr)
        // Continue with other dimensions -- partial scoring is better than none
      }
    }

    // ── 5. Update assessment progress ──
    await serviceClient
      .from('profiles')
      .update({ assessment_progress: module } as never)
      .eq('id', user.id)
      .lt('assessment_progress', module) // Only advance, never regress

    // ── 6. Audit log ──
    await serviceClient.from('audit_log').insert({
      user_id: user.id,
      action: 'assessment_submitted',
      resource_type: 'assessment_responses',
      resource_id: `module_${module}`,
      metadata: {
        question_count: Object.keys(answers).length,
        dimensions_scored: computedScores.map(s => s.dimensionId),
        scores: computedScores.map(s => ({
          dimension: s.dimensionId,
          overall: Math.round(s.overallScore * 100) / 100,
        })),
      },
    } as never)

    // ── 7. Build response ──
    const unlocked = getUnlockedProfileCount(module)
    const scoresSummary = computedScores.reduce((acc, s) => {
      acc[s.dimensionId] = {
        overall: Math.round(s.overallScore * 100) / 100,
        subScales: Object.fromEntries(
          Object.entries(s.subScaleScores).map(([k, v]) => [k, Math.round(v * 100) / 100])
        ),
      }
      return acc
    }, {} as Record<string, { overall: number; subScales: Record<string, number> }>)

    return NextResponse.json({
      module,
      completed: true,
      profilesUnlocked: unlocked,
      scores: scoresSummary,
    })
  } catch (err) {
    console.error('Assessment submission error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
