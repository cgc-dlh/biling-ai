import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!url || !key) {
      return NextResponse.json([]);
    }

    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('trending_titles')
      .select('*')
      .order('shares', { ascending: false })
      .limit(20);

    if (error || !data) {
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
