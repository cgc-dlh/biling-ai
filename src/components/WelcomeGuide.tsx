'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const WELCOME_KEY = 'jianjing_welcome_dismissed';

export default function WelcomeGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(WELCOME_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(WELCOME_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-8 mx-4 max-w-md text-center animate-in" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 0 60px rgba(45,212,191,0.15)' }}>
        <div className="text-5xl mb-4">🐋</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>欢迎来到见鲸</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
          先花 1 分钟设置你的品牌风格，AI 会自动记住<br />
          之后每次生成都带着你的味道
        </p>
        <div className="space-y-2">
          <Link
            href="/brand"
            onClick={dismiss}
            className="block w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, var(--teal), #0EA5E9)', color: '#fff' }}
          >
            去设置品牌
          </Link>
          <button
            onClick={dismiss}
            className="block w-full py-2 rounded-lg text-xs font-medium transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            跳过，直接使用
          </button>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
            随时可在导航栏「我的品牌」中修改
          </p>
        </div>
      </div>
    </div>
  );
}
