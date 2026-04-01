import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const FOUNDING_MEMBER_LIMIT = 1000

interface FoundingMemberCountResponse {
  count: number
  limit: number
}

export async function GET(): Promise<NextResponse<FoundingMemberCountResponse | { error: string }>> {
  try {
    const supabase = await getSupabaseServiceClient()

    if (!supabase) {
      return NextResponse.json(
        { count: 0, limit: FOUNDING_MEMBER_LIMIT },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        }
      )
    }

    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'founding_member')

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch founding member count' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { count: count ?? 0, limit: FOUNDING_MEMBER_LIMIT },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

export const revalidate = 60
