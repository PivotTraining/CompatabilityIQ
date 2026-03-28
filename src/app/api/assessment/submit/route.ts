import { NextResponse } from 'next/server'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'
import { MODULE_CONFIG, getUnlockedProfileCount } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { module, answers } = body as { module: number; answers: Record<string, number> }

    // Validate module number
    if (!module || module < 1 || module > 6) {
      return NextResponse.json({ error: 'Invalid module' }, { status: 400 })
    }

    // Validate answer count
    const expectedCount = MODULE_CONFIG[module - 1]?.questionCount
    if (!expectedCount || Object.keys(answers).length !== expectedCount) {
      return NextResponse.json({ error: 'Incomplete answers' }, { status: 400 })
    }

    // Store answers using service client (encrypted in production via Edge Function)
    // For MVP: store as JSON in encrypted_responses field
    const serviceClient = await getSupabaseServiceClient()
    if (!serviceClient) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const responsePayload = JSON.stringify(answers)
    const encoder = new TextEncoder()
    const responseBytes = encoder.encode(responsePayload)

    // Simple hash for integrity verification
    const hashBuffer = await crypto.subtle.digest('SHA-256', responseBytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const responseHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Upsert assessment responses
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

    // Update assessment progress
    await serviceClient
      .from('profiles')
      .update({ assessment_progress: module } as never)
      .eq('id', user.id)
      .lt('assessment_progress', module) // Only advance, never regress

    // TODO: In production, call Edge Function here to compute scores
    // For MVP: scores computed when all 6 modules are complete

    // Audit log
    await serviceClient.from('audit_log').insert({
      user_id: user.id,
      action: 'assessment_submitted',
      resource_type: 'assessment_responses',
      resource_id: `module_${module}`,
      metadata: { question_count: Object.keys(answers).length },
    } as never)

    const unlocked = getUnlockedProfileCount(module)

    return NextResponse.json({
      module,
      completed: true,
      profilesUnlocked: unlocked,
    })
  } catch (err) {
    console.error('Assessment submission error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
