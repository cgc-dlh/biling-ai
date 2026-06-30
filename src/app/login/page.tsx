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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'var(--ocean-deep)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 no-underline group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(14,165,233,0.2))', border: '1px solid rgba(45,212,191,0.3)' }}>
              <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="14" stroke="#2DD4BF" strokeWidth="2" fill="none"/>
                <path d="M10 20 C8 22, 6 18, 12 14 C14 12, 10 11, 15 6 C9 11, 10 11, 12 14 C8 18, 6 22, 10 20Z" fill="#2DD4BF" fillOpacity="0.6"/>
                <circle cx="15" cy="10" r="1.5" fill="#F59E0B"/>
              </svg>
            </div>
            <span className="font-bold text-2xl" style={{ color: '#2DD4BF' }}>见鲸</span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            {isSignUp ? '创建你的账号，开始智能内容创作' : '登录账号，继续使用 AI 创作'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          {inviteCode && isSignUp && (
            <div className="mb-6 p-4 rounded-xl text-sm flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <span className="text-xl flex-shrink-0">🎁</span>
              <div>
                <p className="font-medium" style={{ color: 'var(--gold)' }}>邀请福利</p>
                <p className="mt-1" style={{ color: 'var(--muted)' }}>通过邀请码 <strong style={{ color: 'var(--ink)' }}>{inviteCode}</strong> 注册，你将获得 5 次额外免费额度。</p>
              </div>
            </div>
          )}

          {/* Toggle tabs */}
          <div className="flex rounded-xl mb-6 overflow-hidden" style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => { setIsSignUp(false); setError(''); setMessage(''); }}
              className="flex-1 py-2.5 text-sm font-medium transition-all"
              style={{
                background: !isSignUp ? 'var(--teal)' : 'transparent',
                color: !isSignUp ? '#0A1929' : 'var(--muted)',
              }}
            >
              登录
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); setMessage(''); }}
              className="flex-1 py-2.5 text-sm font-medium transition-all"
              style={{
                background: isSignUp ? 'var(--teal)' : 'transparent',
                color: isSignUp ? '#0A1929' : 'var(--muted)',
              }}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--muted)' }}>邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="w-full p-3 rounded-xl text-sm"
                style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--muted)' }}>密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? '至少6位字符' : '输入你的密码'}
                  required
                  minLength={isSignUp ? 6 : 1}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full p-3 pr-12 rounded-xl text-sm"
                  style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded transition-colors"
                  style={{ color: 'var(--muted)', background: 'transparent' }}
                >
                  {showPassword ? '隐藏' : '显示'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm flex items-center gap-2" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span>⚠️</span> {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-xl text-sm flex items-center gap-2" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span>✅</span> {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              style={{ background: loading ? 'var(--ocean-surface)' : 'linear-gradient(135deg, #2DD4BF, #0EA5E9)', boxShadow: loading ? 'none' : '0 4px 16px rgba(45,212,191,0.3)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  处理中...
                </span>
              ) : (
                isSignUp ? '创建账号' : '登录'
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs text-center mb-3" style={{ color: 'var(--muted)' }}>注册即享</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '🤖', text: 'AI 标题生成' },
                { icon: '📊', text: 'SEO 分析' },
                { icon: '📅', text: '内容日历' },
              ].map((f) => (
                <div key={f.text} className="text-center p-2 rounded-lg" style={{ background: 'var(--ocean-deep)' }}>
                  <div className="text-lg mb-1">{f.icon}</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm inline-flex items-center gap-1 transition-colors hover:underline" style={{ color: 'var(--muted)' }}>
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
