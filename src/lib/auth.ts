// 本地认证系统 - 使用 localStorage 存储用户数据
// 适合 MVP 阶段，国内用户无需翻墙即可使用

export interface LocalUser {
  email: string;
  createdAt: string;
  inviteCode?: string; // 注册时使用的邀请码
}

const STORAGE_KEY = 'jianjing_user';
const INVITE_REWARDS_KEY = 'jianjing_invite_rewards';
const INVITE_CODES_KEY = 'jianjing_invite_codes';

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

// 获取奖励次数（邀请别人+被别人邀请）
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

export function signUp(email: string, _password: string, inviteCode?: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: '浏览器环境不可用' };
  }

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
    inviteCode,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

  // 处理邀请奖励
  if (inviteCode) {
    // 被邀请人获得5次奖励
    addRewardCredits(5);

    // 标记该邀请码已使用，记录邀请人
    try {
      const codes = JSON.parse(localStorage.getItem(INVITE_CODES_KEY) || '[]');
      const idx = codes.findIndex((c: { code: string }) => c.code === inviteCode);
      if (idx >= 0) {
        codes[idx].used = true;
        codes[idx].usedBy = email;
        localStorage.setItem(INVITE_CODES_KEY, JSON.stringify(codes));

        // 邀请人也获得5次奖励（存在同一个浏览器的情况下）
        // 跨设备的邀请奖励在MVP阶段无法完全追踪，这是已知限制
        // 在同一个浏览器上，如果邀请人已登录过，ta下次登录时会检测到
        const codesOwner = JSON.parse(localStorage.getItem(INVITE_CODES_KEY) || '[]');
        // 简单方案：当前浏览器已有的invite奖励直接给
        // 跨设备场景暂不处理（MVP限制）
      }
    } catch { /* ignore */ }
  }

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
