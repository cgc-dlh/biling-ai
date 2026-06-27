'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

const CAL_KEY = 'jianjing_calendar_plans';

interface Plan {
  date: string;
  title: string;
  platform: string;
  status: 'pending' | 'done';
}

function loadPlans(): Plan[] {
  try { return JSON.parse(localStorage.getItem(CAL_KEY) || '[]'); } catch { return []; }
}

function savePlans(plans: Plan[]) {
  localStorage.setItem(CAL_KEY, JSON.stringify(plans));
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const NOW = new Date();

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (number | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

export default function CalendarPage() {
  const [year, setYear] = useState(NOW.getFullYear());
  const [month, setMonth] = useState(NOW.getMonth());
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showAdd, setShowAdd] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('wechat');
  const router = useRouter();

  useEffect(() => { setPlans(loadPlans()); }, []);

  const dateStr = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const handleDayClick = (d: number) => {
    const dayPlans = plans.filter(p => p.date === dateStr(d));
    if (dayPlans.length > 0) {
      // 有发布计划 → 跳到内容优化页
      router.push('/optimize');
    } else {
      // 无计划 → 添加计划
      setShowAdd(showAdd === d ? null : d);
    }
  };

  const addPlan = (d: number) => {
    if (!newTitle.trim()) return;
    const next: Plan[] = [...plans, { date: dateStr(d), title: newTitle.trim(), platform: newPlatform, status: 'pending' }];
    setPlans(next);
    savePlans(next);
    setNewTitle('');
    setNewPlatform('wechat');
    setShowAdd(null);
  };

  const toggleStatus = (idx: number) => {
    const next = plans.map((p, i) => i === idx ? { ...p, status: p.status === 'done' ? 'pending' as const : 'done' as const } : p);
    setPlans(next);
    savePlans(next);
  };

  const deletePlan = (idx: number) => {
    const next = plans.filter((_, i) => i !== idx);
    setPlans(next);
    savePlans(next);
  };

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const days = getMonthDays(year, month);

  // upcoming plans not yet done
  const upcoming = plans
    .filter(p => p.status === 'pending')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <Header current="/calendar" />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>内容日历</h1>
          <p style={{ color: 'var(--muted)' }}>规划发布节奏，不再断更</p>
        </div>

        {/* Calendar */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="px-3 py-1 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--muted)', border: '1px solid var(--border-subtle)' }}>← 上月</button>
            <span className="text-lg font-bold" style={{ color: 'var(--ink)' }}>{year}年{month + 1}月</span>
            <button onClick={nextMonth} className="px-3 py-1 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--muted)', border: '1px solid var(--border-subtle)' }}>下月 →</button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map(w => (
              <div key={w} className="text-center text-xs py-1 font-semibold" style={{ color: 'var(--muted)' }}>{w}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const ds = dateStr(d);
              const dayPlans = plans.filter(p => p.date === ds);
              const isToday = ds === `${NOW.getFullYear()}-${String(NOW.getMonth()+1).padStart(2,'0')}-${String(NOW.getDate()).padStart(2,'0')}`;
              const hasPlan = dayPlans.length > 0;
              return (
                <div
                  key={ds}
                  className="relative rounded-lg p-1 text-center cursor-pointer transition-all min-h-[60px]"
                  style={{
                    background: isToday ? 'rgba(45,212,191,0.12)' : 'var(--ocean-deep)',
                    border: isToday ? '1px solid var(--teal)' : '1px solid transparent',
                  }}
                  onClick={() => handleDayClick(d)}
                >
                  <div className="text-xs font-medium" style={{ color: isToday ? 'var(--teal)' : 'var(--muted)' }}>{d}</div>
                  {hasPlan && (
                    <div className="mt-1">
                      {dayPlans.slice(0, 2).map((p, pi) => (
                        <div key={pi} className="text-[10px] truncate rounded px-1 py-0.5" style={{
                          background: p.status === 'done' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                          color: p.status === 'done' ? '#10B981' : 'var(--gold)',
                        }}>{p.title.slice(0, 6)}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add quick dialog */}
          {showAdd !== null && (
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                {month + 1}月{showAdd}日 · 添加发布计划
              </p>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="标题/主题"
                className="w-full p-2 rounded-lg text-sm mb-2"
                style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
                onKeyDown={e => { if (e.key === 'Enter') addPlan(showAdd); }}
              />
              <div className="flex gap-2">
                <select
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value)}
                  className="flex-1 p-2 rounded-lg text-sm"
                  style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
                >
                  {['wechat','xiaohongshu','zhihu','toutiao','douyin','bilibili','weibo','kuaishou'].map(v => (
                    <option key={v} value={v}>{v === 'wechat' ? '公众号' : v === 'xiaohongshu' ? '小红书' : v === 'zhihu' ? '知乎' : v === 'toutiao' ? '头条' : v === 'douyin' ? '抖音' : v === 'bilibili' ? 'B站' : v === 'weibo' ? '微博' : '快手'}</option>
                  ))}
                </select>
                <button
                  onClick={() => addPlan(showAdd)}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: 'var(--teal)', color: '#0A1929' }}
                >
                  添加
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--ink)' }}>待发布</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>没有待发布的计划</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((p, i) => {
                const idx = plans.findIndex(x => x.date === p.date && x.title === p.title);
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg text-sm" style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
                    <span className="text-xs font-medium" style={{ color: 'var(--teal)' }}>{p.date}</span>
                    <span className="flex-1" style={{ color: 'var(--ink)' }}>{p.title}</span>
                    <button onClick={() => toggleStatus(idx)} className="px-2 py-1 text-xs rounded" style={{ color: 'var(--teal)', border: '1px solid var(--border-subtle)' }}>
                      {p.status === 'done' ? '✓ 完成' : '标记完成'}
                    </button>
                    <button onClick={() => deletePlan(idx)} className="text-xs" style={{ color: '#EF4444' }}>删除</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
