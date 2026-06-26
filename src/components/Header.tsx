'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// 导航菜单配置
const NAV_ITEMS = [
  { href: '/', label: '标题生成' },
  { href: '/seo', label: 'SEO分析' },
  { href: '/optimize', label: '内容优化' },
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
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">✏</div>
          <span className="font-bold text-lg text-blue-600">笔灵AI</span>
        </Link>
        {/* 导航链接 + 登录/用户信息 */}
        <nav className="flex items-center gap-4 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={current === item.href ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-blue-600 transition-colors'}>
              {item.label}
            </Link>
          ))}
          {userEmail ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-gray-600 text-xs hidden sm:inline">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                退出
              </button>
            </div>
          ) : (
            <Link href="/login" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors no-underline">
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
