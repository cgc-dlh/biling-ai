// 纯 localStorage 认证系统 — 确保国内用户无需 VPN 即可使用

export interface LocalUser {
  email: string;
  userId: string;
  createdAt: string;
  inviteCode?: string;
}

interface StoredUser {
  email: string;
  passwordHash: string;
  userId: string;
  createdAt: string;
  inviteCode?: string;
}

const AUTH_KEY = 'jianjing_auth_user';
const USER_DB_KEY = 'jianjing_user_db';
const INVITE_REWARDS_KEY = 'jianjing_invite_rewards';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function getUserDB(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USER_DB_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUserDB(users: StoredUser[]) {
  localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
}

export function getCurrentUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalUser;
  } catch {
    return null;
  }
}

export function getRewardCredits(): number {
  try {
    return parseInt(localStorage.getItem(INVITE_REWARDS_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function addRewardCredits(amount: number) {
  const cur = getRewardCredits();
  localStorage.setItem(INVITE_REWARDS_KEY, String(cur + amount));
}

export async function signUp(
  email: string,
  password: string,
  inviteCode?: string
): Promise<{ success: boolean; error?: string }> {
  const users = getUserDB();
  if (users.some((u) => u.email === email)) {
    return { success: false, error: '该邮箱已注册' };
  }

  const user: StoredUser = {
    email,
    passwordHash: simpleHash(password),
    userId: generateUUID(),
    createdAt: new Date().toISOString(),
    inviteCode: inviteCode || undefined,
  };

  users.push(user);
  saveUserDB(users);

  // 自动登录
  const localUser: LocalUser = {
    email: user.email,
    userId: user.userId,
    createdAt: user.createdAt,
    inviteCode: user.inviteCode,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(localUser));

  // 处理邀请奖励
  if (inviteCode) {
    addRewardCredits(5);
  }

  return { success: true };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const users = getUserDB();
  const user = users.find(
    (u) => u.email === email && u.passwordHash === simpleHash(password)
  );

  if (!user) {
    return { success: false, error: '邮箱或密码错误' };
  }

  const localUser: LocalUser = {
    email: user.email,
    userId: user.userId,
    createdAt: user.createdAt,
    inviteCode: user.inviteCode,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(localUser));

  return { success: true };
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  try {
    const user = localStorage.getItem(AUTH_KEY);
    return !!user;
  } catch {
    return false;
  }
}
