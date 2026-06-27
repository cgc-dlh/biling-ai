'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// 导航菜单配置
const NAV_ITEMS = [
  { href: '/', label: '标题生成' },
  { href: '/optimize', label: '内容优化' },
  { href: '/lab', label: '实验室' },
  { href: '/calendar', label: '日历' },
  { href: '/invite', label: '邀请' },
];

/**
 * 共享 Header 组件
 * @param current - 当前页面路径，用于高亮导航项
 */
export default function Header({ current = '/' }: { current?: string }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    signOut();
    setUserEmail(null);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(10,25,41,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="14" stroke="#2DD4BF" strokeWidth="2" fill="none"/>
            <path d="M10 20 C8 22, 6 18, 12 14 C14 12, 10 11, 15 6 C9 11, 10 11, 12 14 C8 18, 6 22, 10 20Z" fill="#2DD4BF" fillOpacity="0.6"/>
            <circle cx="15" cy="10" r="1.5" fill="#F59E0B"/>
          </svg>
          <span className="font-bold text-lg" style={{ color: '#2DD4BF' }}>见鲸</span>
        </Link>
        {/* 导航链接 + 登录/用户信息 */}
        <nav className="flex items-center gap-1 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2 py-1 rounded-lg transition-colors ${
                current === item.href
                  ? 'font-semibold'
                  : ''
              }`}
              style={{
                color: current === item.href ? '#2DD4BF' : 'var(--muted)',
                background: current === item.href ? 'rgba(45,212,191,0.08)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
          {userEmail ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/brand"
                className="text-xs px-2 py-1 rounded-lg transition-colors"
                style={{ color: 'var(--muted)', border: '1px solid var(--border-subtle)' }}
              >
                我的品牌
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded-lg text-xs font-medium transition-colors"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--muted)' }}
              >
                退出
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 px-3 py-1 text-white rounded-lg text-xs font-medium transition-all"
              style={{ background: 'linear-gradient(135deg, #2DD4BF, #0EA5E9)' }}
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
