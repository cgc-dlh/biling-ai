// 日历计划云端同步 - 对接 Supabase calendar_plans 表
import { getSupabase } from './supabase';

export interface CalendarPlan {
  date: string;
  title: string;
  platform: string;
  status: 'draft' | 'published' | 'archived';
}

// 从云端加载日历计划
export async function loadCalendarPlans(userId: string): Promise<CalendarPlan[]> {
  const s = await getSupabase();
  const { data, error } = await s
    .from('calendar_plans')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error || !data) return [];

  return data.map(item => ({
    date: item.date,
    title: item.title,
    platform: item.platform || '',
    status: item.status as 'draft' | 'published' | 'archived',
  }));
}

// 保存计划
export async function savePlan(userId: string, plan: CalendarPlan) {
  const s = await getSupabase();
  const { error } = await s
    .from('calendar_plans')
    .insert({
      user_id: userId,
      date: plan.date,
      title: plan.title,
      platform: plan.platform,
      status: plan.status,
    });

  if (error) throw error;
}

// 删除计划
export async function deletePlan(userId: string, id: number) {
  const s = await getSupabase();
  const { error } = await s
    .from('calendar_plans')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// 更新计划
export async function updatePlan(userId: string, id: number, updates: Partial<CalendarPlan>) {
  const s = await getSupabase();
  const { error } = await s
    .from('calendar_plans')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}
