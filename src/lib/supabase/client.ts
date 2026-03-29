import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || url.includes('placeholder')) {
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return client
}
