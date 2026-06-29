// Supabase 认证系统 - 对接云端
// 替换原有的 localStorage 认证

import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface LocalUser {
  email: string;
  userId: string;
  createdAt: string;
  inviteCode?: string;
}

export async function getCurrentUser(): Promise<LocalUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  
  return {
    email: session.user.email || '',
    userId: session.user.id,
    createdAt: session.user.created_at || new Date().toISOString(),
  };
}

export function getRewardCredits(): number {
  try {
    return parseInt(localStorage.getItem('jianjing_invite_rewards') || '0', 10);
  } catch {
    return 0;
  }
}

function addRewardCredits(amount: number) {
  const cur = getRewardCredits();
  localStorage.setItem('jianjing_invite_rewards', String(cur + amount));
}

export async function signUp(email: string, password: string, inviteCode?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        inviteCode: inviteCode || null,
      }
    }
  });

  if (error) return { success: false, error: error.message };
  if (!data.user) return { success: false, error: '注册失败' };

  // 创建 profile 记录
  await supabase.from('profiles').insert({
    id: data.user.id,
    email,
  });

  // 创建 usage_stats 记录
  await supabase.from('usage_stats').insert({
    user_id: data.user.id,
  });

  // 处理邀请奖励
  if (inviteCode) {
    addRewardCredits(5);
    
    // 记录邀请
    await supabase.from('invitations').insert({
      invitee_email: email,
      invite_code: inviteCode,
    });
  }

  return { success: true };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  if (!data.user) return { success: false, error: '登录失败' };

  return { success: true };
}

export async function signOut() {
  await supabase.auth.signOut();
  localStorage.removeItem('jianjing_user');
}

export function isLoggedIn(): boolean {
  // 客户端检查
  try {
    const user = localStorage.getItem('jianjing_user');
    return !!user;
  } catch {
    return false;
  }
}
