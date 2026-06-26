import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const mockClient = {
  auth: {
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase 未配置，请在 Vercel 环境变量中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY') }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase 未配置') }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Supabase 未配置') }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
} as unknown as SupabaseClient;

export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('placeholder')) {
    return mockClient;
  }

  return createBrowserClient(url, key);
}
