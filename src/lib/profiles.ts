// 品牌分身云端同步 - 对接 Supabase profiles 表
import { getSupabase } from './supabase';

export interface BrandProfile {
  track: string;
  persona: string;
  toneTags: string[];
  forbiddenWords: string[];
  sampleTexts: string[];
}

// 从云端加载品牌分身
export async function loadBrandProfile(userId: string): Promise<BrandProfile | null> {
  const s = await getSupabase();
  const { data, error } = await s
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    track: data.track || '科技',
    persona: data.persona || '专家型',
    toneTags: data.tone_tags || [],
    forbiddenWords: data.forbidden_words || [],
    sampleTexts: data.sample_texts || [],
  };
}

// 保存到云端
export async function saveBrandProfile(userId: string, profile: BrandProfile) {
  const s = await getSupabase();
  const { error } = await s
    .from('profiles')
    .upsert({
      id: userId,
      track: profile.track,
      persona: profile.persona,
      tone_tags: profile.toneTags,
      forbidden_words: profile.forbiddenWords,
      sample_texts: profile.sampleTexts,
    });

  if (error) throw error;
}
