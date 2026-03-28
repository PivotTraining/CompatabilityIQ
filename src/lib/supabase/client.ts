import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!url && !url.includes('placeholder')
}

export function getSupabaseBrowserClient() {
  if (client) return client

  if (!isSupabaseConfigured()) {
    // Return a no-op proxy that won't make network requests
    // This prevents hangs when using placeholder credentials
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return client
}
