import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export async function getSupabase(): Promise<SupabaseClient> {
  if (client) return client

  let url = ''
  let key = ''

  // 客户端：优先从 window.__ENV__ 读取（避免 NEXT_PUBLIC_ 被构建内联到 JS bundle）
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    url = (window as any).__ENV__.SUPABASE_URL
    key = (window as any).__ENV__.SUPABASE_ANON_KEY
  } else if (typeof process !== 'undefined' && process.env) {
    // 服务端：使用方括号语法避免 DefinePlugin 静态内联
    const env = process.env as Record<string, string | undefined>
    url = env['SUPABASE_URL'] || env['NEXT_PUBLIC_SUPABASE_URL'] || ''
    key = env['SUPABASE_ANON_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || ''
  }

  if (!url || !key) {
    throw new Error('Supabase configuration not available')
  }

  client = createClient(url, key)
  return client
}
