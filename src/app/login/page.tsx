'use client';

import { useState, useEffect, useMemo } from 'react';
import { signUp, signIn, getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 从 URL 中读取邀请码
  const inviteCode = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search);
    return p.get('invite');
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) router.push('/');
    // 如果有邀请码，自动切到注册模式
    if (inviteCode) setIsSignUp(true);
  }, [router, inviteCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const result = signUp(email, password, inviteCode || undefined);
        if (!result.success) {
          setError(result.error || '注册失败');
        } else {
          setMessage(inviteCode ? '注册成功！你已获得 5 次邀请奖励。' : '注册成功！已自动登录。');
          setTimeout(() => router.push('/'), 1000);
        }
      } else {
        const result = signIn(email, password);
        if (!result.success) {
          setError(result.error || '登录失败');
        } else {
          router.push('/');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '操作失败';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ocean-deep)' }}>
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <svg width="36" height="36" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="14" stroke="#2DD4BF" strokeWidth="2" fill="none"/>
              <path d="M10 20 C8 22, 6 18, 12 14 C14 12, 10 11, 15 6 C9 11, 10 11, 12 14 C8 18, 6 22, 10 20Z" fill="#2DD4BF" fillOpacity="0.6"/>
              <circle cx="15" cy="10" r="1.5" fill="#F59E0B"/>
            </svg>
            <span className="font-bold text-2xl" style={{ color: '#2DD4BF' }}>见鲸</span>
          </Link>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          {inviteCode && isSignUp && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: 'var(--gold)' }}>
              通过邀请码 <strong>{inviteCode}</strong> 注册，你将获得 5 次额外免费额度。
            </div>
          )}
          <h2 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--ink)' }}>
            {isSignUp ? '创建账号' : '登录'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full p-2.5 rounded-lg text-sm"
                style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6位"
                required
                minLength={6}
                className="w-full p-2.5 rounded-lg text-sm"
                style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
              />
            </div>

            {error && <p className="text-sm px-4 py-2 rounded-lg" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)' }}>{error}</p>}
            {message && <p className="text-sm px-4 py-2 rounded-lg" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)' }}>{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #2DD4BF, #0EA5E9)' }}
            >
              {loading ? '处理中...' : isSignUp ? '注册' : '登录'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm" style={{ color: 'var(--muted)' }}>
            {isSignUp ? '已有账号？' : '没有账号？'}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
              className="font-medium ml-1 hover:underline"
              style={{ color: 'var(--teal)' }}
            >
              {isSignUp ? '去登录' : '去注册'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
