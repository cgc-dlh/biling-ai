'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const INVITE_KEY = 'jianjing_invite_codes';

interface InviteCode {
  code: string;
  created: string;
  used: boolean;
  usedBy?: string;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function loadCodes(): InviteCode[] {
  try { return JSON.parse(localStorage.getItem(INVITE_KEY) || '[]'); } catch { return []; }
}

function saveCodes(codes: InviteCode[]) {
  localStorage.setItem(INVITE_KEY, JSON.stringify(codes));
}

const BASE_URL = 'https://golden-gingersnap-790cb7.netlify.app';

export default function InvitePage() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) { router.push('/login'); return; }
    setCodes(loadCodes());
  }, [router]);

  const createCode = () => {
    const next = [...codes, { code: generateCode(), created: new Date().toISOString(), used: false }];
    setCodes(next);
    saveCodes(next);
  };

  const copyLink = async (code: string, idx: number) => {
    const link = `${BASE_URL}/login?invite=${code}`;
    try { await navigator.clipboard.writeText(link); } catch {
      const ta = document.createElement('textarea');
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <Header current="/invite" />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>邀请好友</h1>
          <p style={{ color: 'var(--muted)' }}>每邀请一位好友注册，双方各获得 5 次额外免费额度</p>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold" style={{ color: 'var(--ink)' }}>我的邀请码</span>
            <button
              onClick={createCode}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'var(--teal)', color: '#0A1929' }}
            >
              生成新邀请码
            </button>
          </div>

          {codes.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--muted)' }}>
              <p className="mb-2">还没有邀请码</p>
              <p className="text-xs">点击「生成新邀请码」创建你的专属邀请链接</p>
            </div>
          ) : (
            <div className="space-y-3">
              {codes.map((c, i) => (
                <div
                  key={c.code}
                  className="flex items-center gap-3 p-3 rounded-lg text-sm"
                  style={{
                    background: c.used ? 'rgba(16,185,129,0.06)' : 'var(--ocean-deep)',
                    border: `1px solid ${c.used ? 'rgba(16,185,129,0.2)' : 'var(--border-subtle)'}`,
                    opacity: c.used ? 0.6 : 1,
                  }}
                >
                  <code className="flex-shrink-0 font-mono font-bold text-lg tracking-wider" style={{ color: c.used ? '#10B981' : 'var(--gold)' }}>
                    {c.code}
                  </code>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(c.created).toLocaleDateString('zh-CN')}
                    </div>
                    {c.used && <div className="text-xs" style={{ color: '#10B981' }}>已被 {c.usedBy || '好友'} 使用</div>}
                  </div>
                  {!c.used && (
                    <button
                      onClick={() => copyLink(c.code, i)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex-shrink-0"
                      style={{ borderColor: 'var(--border-subtle)', color: copiedIdx === i ? '#10B981' : 'var(--teal)' }}
                    >
                      {copiedIdx === i ? '已复制' : '复制链接'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--ink)' }}>规则说明</h3>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--muted)' }}>
            <li>· 每位用户可生成最多 10 个邀请码</li>
            <li>· 好友通过邀请链接注册后，双方各获得 5 次额外免费额度</li>
            <li>· 每个邀请码只能被使用一次</li>
            <li>· 内测期间免费，邀请奖励将在正式版上线后生效</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
