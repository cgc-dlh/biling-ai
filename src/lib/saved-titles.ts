// 收藏标题云端同步 - 对接 Supabase saved_titles 表
import { supabase } from './supabase';

export interface SavedTitle {
  title: string;
  score: number;
  platform: string;
}

// 从云端加载收藏标题
export async function loadSavedTitles(userId: string): Promise<SavedTitle[]> {
  const { data, error } = await supabase
    .from('saved_titles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(item => ({
    title: item.title,
    score: item.score || 0,
    platform: item.platform || '',
  }));
}

// 保存到云端
export async function saveTitle(userId: string, title: string, score: number, platform: string) {
  const { error } = await supabase
    .from('saved_titles')
    .insert({ user_id: userId, title, score, platform });

  if (error) throw error;
}

// 删除收藏
export async function deleteTitle(userId: string, id: number) {
  const { error } = await supabase
    .from('saved_titles')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}
