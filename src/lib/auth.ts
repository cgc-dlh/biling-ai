// 本地认证系统 - 使用 localStorage 存储用户数据
// 适合 MVP 阶段，国内用户无需翻墙即可使用

export interface LocalUser {
  email: string;
  createdAt: string;
}

const STORAGE_KEY = 'biling_ai_user';

export function getCurrentUser(): LocalUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalUser;
  } catch {
    return null;
  }
}

export function signUp(email: string, _password: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: '浏览器环境不可用' };
  }

  // 简单验证
  if (!email.includes('@')) {
    return { success: false, error: '邮箱格式不正确' };
  }

  // 检查是否已注册
  const existing = getCurrentUser();
  if (existing && existing.email === email) {
    return { success: false, error: '该邮箱已注册，请直接登录' };
  }

  const user: LocalUser = {
    email,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return { success: true };
}

export function signIn(email: string, _password: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: '浏览器环境不可用' };
  }

  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: '该邮箱未注册，请先注册' };
  }

  if (user.email !== email) {
    return { success: false, error: '邮箱或密码错误' };
  }

  return { success: true };
}

export function signOut(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}
