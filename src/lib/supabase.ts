import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null
let initPromise: Promise<SupabaseClient> | null = null

export async function getSupabase(): Promise<SupabaseClient> {
  if (client) return client
  if (initPromise) return initPromise

  initPromise = fetch('/api/config')
    .then(r => r.json())
    .then(({ url, key }) => {
      if (!url || !key) {
        throw new Error('Supabase configuration not available')
      }
      client = createClient(url, key)
      return client
    })

  return initPromise
}
