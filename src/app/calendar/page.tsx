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
  content_type?: string;
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

// AI 发布建议引擎
function getPublishAdvice(platform: string, planCount: number) {
  const adviceMap: Record<string, { bestTimes: string[]; freq: string; tips: string[] }> = {
    wechat: {
      bestTimes: ['周一 8:00', '周二 12:00', '周三 20:00', '周四 18:00', '周五 21:00'],
      freq: '每周 2-3 篇',
      tips: ['深度长文适合晚间阅读', '周末推送打开率较低', '系列内容固定时间发布']
    },
    xiaohongshu: {
      bestTimes: ['周一 12:00', '周二 18:00', '周三 20:00', '周四 12:00', '周五 18:00'],
      freq: '每天 1-2 篇',
      tips: ['图文笔记比纯文字效果好', '周末流量最大', '热门话题标签增加曝光']
    },
    zhihu: {
      bestTimes: ['周二 10:00', '周三 15:00', '周四 20:00', '周五 12:00'],
      freq: '每周 3-5 篇',
      tips: ['回答热点问题是最佳引流方式', '长文在知乎有长尾流量', '专业领域建立权威']
    },
    toutiao: {
      bestTimes: ['周一 7:00', '周二 12:00', '周三 18:00', '周四 7:00', '周五 12:00'],
      freq: '每天 3-5 篇',
      tips: ['标题决定推荐量', '垂直领域获得精准推荐', '持续更新提升账号权重']
    },
    douyin: {
      bestTimes: ['中午 12:00', '傍晚 18:00', '晚上 20:00', '晚上 21:00'],
      freq: '每天 1-3 条',
      tips: ['前3秒决定完播率', '热门BGM增加推荐', '评论互动提升权重']
    },
    bilibili: {
      bestTimes: ['周六 10:00', '周日 10:00', '周五 18:00'],
      freq: '每周 1-2 期',
      tips: ['中长视频适合深度内容', '封面和标题是关键', '粉丝活跃时段集中在周末']
    },
    weibo: {
      bestTimes: ['早 8:00', '午 12:00', '晚 18:00', '深夜 22:00'],
      freq: '每天 5-10 条',
      tips: ['带话题增加曝光', '转发抽奖提升互动', '热搜话题第一时间跟进']
    },
    medium: {
      bestTimes: ['周二 10:00', '周三 14:00', '周四 10:00'],
      freq: '每周 1-2 篇',
      tips: ['英文内容面向全球读者', 'Publication 投稿增加曝光', '标签选择影响推荐']
    },
    linkedin: {
      bestTimes: ['周二 10:00', '周三 9:00', '周四 11:00'],
      freq: '每周 2-3 篇',
      tips: ['职业相关内容效果最好', '个人动态比公司主页流量高', '评论互动提升可见性']
    },
    tiktok: {
      bestTimes: ['中午 12:00', '傍晚 17:00', '晚上 20:00'],
      freq: '每天 1-3 条',
      tips: ['挑战赛和热门音乐是流量密码', '前3秒至关重要', '保持日更提升算法推荐']
    },
    instagram: {
      bestTimes: ['周一 11:00', '周二 10:00', '周三 11:00'],
      freq: '每天 1-2 条 + Stories',
      tips: ['Reels 是目前增长最快的形式', 'Stories 维持日常互动', 'Hashtag 数量 15-30 个最佳']
    },
    youtube: {
      bestTimes: ['周五 14:00', '周六 10:00', '周日 10:00'],
      freq: '每周 1-3 条',
      tips: ['固定更新时间培养观众习惯', 'Shorts 带来新订阅者', 'Thumbnail 决定点击率']
    },
    twitter: {
      bestTimes: ['早 9:00', '午 12:00', '晚 18:00'],
      freq: '每天 3-10 条',
      tips: ['Thread 形式深度内容效果好', '回复热门推文获得曝光', '图片推文互动率更高']
    },
    reddit: {
      bestTimes: ['周一 8:00', '周二 9:00', '周三 10:00'],
      freq: '每天 1-3 条',
      tips: ['选择正确的 subreddit 是关键', '自推内容遵循 10:1 规则', '参与讨论比单纯发帖更重要']
    },
    kuaishou: {
      bestTimes: ['中午 12:00', '傍晚 17:00', '晚上 20:00'],
      freq: '每天 2-5 条',
      tips: ['真实接地气的内容更受欢迎', '老铁文化注重互动', '直播是重要变现方式']
    },
    quora: {
      bestTimes: ['周二 10:00', '周三 14:00', '周四 10:00'],
      freq: '每周 5-10 个回答',
      tips: ['回答高关注问题是最佳策略', '个人简介放链接', '长回答获得更高赞']
    },
    facebook: {
      bestTimes: ['周二 10:00', '周三 11:00', '周四 11:00'],
      freq: '每天 1-3 条',
      tips: ['视频内容自然触达最高', 'Facebook Groups 增加精准曝光', 'Group 帖子比 Page 帖子流量高']
    },
  };

  const defaultAdvice = {
    bestTimes: ['上午 9:00', '中午 12:00', '晚上 20:00'],
    freq: '每周 3-5 篇',
    tips: ['保持内容质量', '稳定更新频率', '关注数据分析']
  };

  const advice = adviceMap[platform] || defaultAdvice;

  // 根据当前月发布计划数量给出建议
  let frequencyAdvice = '';
  if (planCount === 0) {
    frequencyAdvice = '本月暂无发布计划，建议至少安排 2-3 篇内容';
  } else if (planCount <= 3) {
    frequencyAdvice = `本月已安排 ${planCount} 篇，建议增加到 ${advice.freq}`;
  } else if (planCount <= 7) {
    frequencyAdvice = `本月 ${planCount} 篇，频率合理，继续保持！`;
  } else {
    frequencyAdvice = `本月 ${planCount} 篇，更新频率较高，注意内容质量`;
  }

  return { ...advice, frequencyAdvice };
}

export default function CalendarPage() {
  const [year, setYear] = useState(NOW.getFullYear());
  const [month, setMonth] = useState(NOW.getMonth());
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showAdd, setShowAdd] = useState<number | null>(null);
  const [showDayDetail, setShowDayDetail] = useState<number | null>(null);
  const [showAdvice, setShowAdvice] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('wechat');
  const [newContentType, setNewContentType] = useState('article');
  const router = useRouter();

  useEffect(() => { setPlans(loadPlans()); }, []);

  // 关闭弹窗时重置表单
  useEffect(() => {
    if (showAdd === null && showDayDetail === null) {
      setNewTitle('');
      setNewPlatform('wechat');
      setNewContentType('article');
    }
  }, [showAdd, showDayDetail]);

  const dateStr = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // 某天的发布计划数
  const countByDate = (d: number) => plans.filter(p => p.date === dateStr(d)).length;
  // 当月总计划数
  const monthPlanCount = plans.filter(p => {
    const [y, m] = p.date.split('-').map(Number);
    return y === year && m === month + 1;
  }).length;

  const handleDayClick = (d: number) => {
    const dayPlans = plans.filter(p => p.date === dateStr(d));
    if (dayPlans.length > 0) {
      setShowDayDetail(showDayDetail === d ? null : d);
      setShowAdd(null);
    } else {
      setShowAdd(showAdd === d ? null : d);
      setShowDayDetail(null);
    }
  };

  const addPlan = (d: number) => {
    if (!newTitle.trim()) return;
    const next: Plan[] = [...plans, {
      date: dateStr(d),
      title: newTitle.trim(),
      platform: newPlatform,
      content_type: newContentType,
      status: 'pending'
    }];
    setPlans(next);
    savePlans(next);
    setNewTitle('');
    setNewPlatform('wechat');
    setNewContentType('article');
    setShowAdd(null);
  };

  const toggleStatus = (idx: number) => {
    const next = plans.map((p, i) => {
      if (i === idx) {
        return { ...p, status: p.status === 'done' ? ('pending' as const) : ('done' as const) };
      }
      return p;
    });
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

  const upcoming = plans
    .filter(p => p.status === 'pending')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  // 获取当前选中平台的 AI 建议
  const advice = getPublishAdvice(newPlatform, monthPlanCount);

  const PLATFORM_MAP: Record<string, string> = {
    wechat: '公众号', xiaohongshu: '小红书', zhihu: '知乎', toutiao: '头条',
    douyin: '抖音', bilibili: 'B站', weibo: '微博', kuaishou: '快手',
    medium: 'Medium', instagram: 'Instagram', linkedin: 'LinkedIn', tiktok: 'TikTok',
    youtube: 'YouTube', twitter: 'Twitter', reddit: 'Reddit', facebook: 'Facebook', quora: 'Quora'
  };

  const CONTENT_TYPE_MAP: Record<string, string> = {
    article: '文章', video: '视频', image: '图文', thread: '推文', short: '短视频'
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <Header current="/calendar" />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>内容日历</h1>
          <p style={{ color: 'var(--muted)' }}>规划发布节奏，AI 帮你选最佳时间</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：日历 + 待发布 */}
          <div className="lg:col-span-2">
            {/* 日历 */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <button onClick={prevMonth} className="px-3 py-1 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--muted)', border: '1px solid var(--border-subtle)' }}>← 上月</button>
                <span className="text-lg font-bold" style={{ color: 'var(--ink)' }}>{year}年{month + 1}月</span>
                <button onClick={nextMonth} className="px-3 py-1 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--muted)', border: '1px solid var(--border-subtle)' }}>下月 →</button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map(w => (
                  <div key={w} className="text-center text-xs py-1 font-semibold" style={{ color: 'var(--muted)' }}>{w}</div>
                ))}
              </div>

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
                      className="relative rounded-lg p-1 text-center cursor-pointer transition-all min-h-[40px] sm:min-h-[60px]"
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
                          {dayPlans.length > 2 && (
                            <div className="text-[9px]" style={{ color: 'var(--muted)' }}>+{dayPlans.length - 2}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 日期详情 / 快速添加 */}
              {showDayDetail !== null && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                    {month + 1}月{showDayDetail}日 · 共 {plans.filter(p => p.date === dateStr(showDayDetail)).length} 个计划
                  </p>
                  <div className="space-y-2 mb-3">
                    {plans.filter(p => p.date === dateStr(showDayDetail)).map((p, i) => {
                      const idx = plans.findIndex(x => x === p);
                      return (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg text-sm" style={{ background: 'var(--ocean-surface)' }}>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--teal)' }}>{PLATFORM_MAP[p.platform] || p.platform}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>{CONTENT_TYPE_MAP[p.content_type || 'article'] || p.content_type}</span>
                          <span className="flex-1 truncate" style={{ color: 'var(--ink)' }}>{p.title}</span>
                          <button onClick={() => toggleStatus(idx)} className="text-xs px-1.5 rounded" style={{ color: p.status === 'done' ? '#10B981' : 'var(--gold)', border: '1px solid var(--border-subtle)' }}>
                            {p.status === 'done' ? '✓' : '○'}
                          </button>
                          <button onClick={() => deletePlan(idx)} className="text-xs" style={{ color: '#EF4444' }}>删除</button>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setShowDayDetail(null)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--muted)', background: 'transparent' }}>关闭</button>
                </div>
              )}
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
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <select
                      value={newPlatform}
                      onChange={e => setNewPlatform(e.target.value)}
                      className="p-2 rounded-lg text-sm"
                      style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
                    >
                      {Object.entries(PLATFORM_MAP).map(([v, label]) => (
                        <option key={v} value={v}>{label}</option>
                      ))}
                    </select>
                    <select
                      value={newContentType}
                      onChange={e => setNewContentType(e.target.value)}
                      className="p-2 rounded-lg text-sm"
                      style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
                    >
                      {Object.entries(CONTENT_TYPE_MAP).map(([v, label]) => (
                        <option key={v} value={v}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addPlan(showAdd)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--teal)', color: '#0A1929' }}>添加</button>
                    <button onClick={() => setShowAdd(null)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--muted)', background: 'transparent' }}>取消</button>
                  </div>
                </div>
              )}
            </div>

            {/* 待发布列表 */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="font-bold mb-3" style={{ color: 'var(--ink)' }}>待发布 ({upcoming.filter(p => p.status === 'pending').length})</h3>
              {upcoming.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--muted)' }}>没有待发布的计划，点击日历日期添加</p>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((p, i) => {
                    const idx = plans.findIndex(x => x.date === p.date && x.title === p.title);
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg text-sm" style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
                        <span className="text-xs font-medium" style={{ color: 'var(--teal)' }}>{p.date}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--teal)' }}>{PLATFORM_MAP[p.platform] || p.platform}</span>
                        <span className="flex-1" style={{ color: 'var(--ink)' }}>{p.title}</span>
                        {p.status === 'done' && <span className="text-xs" style={{ color: '#10B981' }}>✓</span>}
                        <button onClick={() => toggleStatus(idx)} className="px-2 py-1 text-xs rounded" style={{ color: 'var(--teal)', border: '1px solid var(--border-subtle)' }}>
                          {p.status === 'done' ? '撤销' : '完成'}
                        </button>
                        <button onClick={() => deletePlan(idx)} className="text-xs" style={{ color: '#EF4444' }}>删除</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：AI 发布建议 + 统计 */}
          <div>
            <button
              onClick={() => setShowAdvice(!showAdvice)}
              className="w-full p-4 rounded-2xl text-left transition-all mb-4"
              style={{
                background: showAdvice ? 'var(--ocean-surface)' : 'linear-gradient(135deg, rgba(45,212,191,0.15), rgba(245,158,11,0.1))',
                border: '1px solid var(--teal)',
                boxShadow: '0 0 20px rgba(45,212,191,0.1)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🤖</span>
                <h3 className="font-bold" style={{ color: 'var(--ink)' }}>AI 发布建议</h3>
              </div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{showAdvice ? '点击收起' : '点击展开最佳发布策略'}</p>
            </button>

            <button
              onClick={() => setShowStats(!showStats)}
              className="w-full p-4 rounded-2xl text-left transition-all mb-4"
              style={{
                background: showStats ? 'var(--ocean-surface)' : 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(45,212,191,0.1))',
                border: '1px solid #8B5CF6',
                boxShadow: '0 0 20px rgba(139,92,246,0.1)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📊</span>
                <h3 className="font-bold" style={{ color: 'var(--ink)' }}>发布统计</h3>
              </div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{showStats ? '点击收起' : `本月 ${monthPlanCount} 篇 · 点击查看详情`}</p>
            </button>

            {showStats && (
              <div className="space-y-4 mb-4">
                {/* 平台统计 */}
                <div className="rounded-xl p-4" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>📱 各平台发布量</h4>
                  {(() => {
                    const platformCounts: Record<string, number> = {};
                    plans.forEach(p => {
                      const key = PLATFORM_MAP[p.platform] || p.platform;
                      platformCounts[key] = (platformCounts[key] || 0) + 1;
                    });
                    const sorted = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
                    if (sorted.length === 0) {
                      return <p className="text-xs" style={{ color: 'var(--muted)' }}>暂无数据</p>;
                    }
                    const max = sorted[0][1];
                    return (
                      <div className="space-y-2">
                        {sorted.map(([name, count]) => (
                          <div key={name}>
                            <div className="flex justify-between text-xs mb-1">
                              <span style={{ color: 'var(--ink)' }}>{name}</span>
                              <span style={{ color: 'var(--muted)' }}>{count} 篇</span>
                            </div>
                            <div className="h-2 rounded-full" style={{ background: 'var(--ocean-deep)' }}>
                              <div className="h-2 rounded-full transition-all" style={{ width: `${(count / max) * 100}%`, background: 'linear-gradient(90deg, #2DD4BF, #8B5CF6)' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* 内容类型统计 */}
                <div className="rounded-xl p-4" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>📝 内容类型分布</h4>
                  {(() => {
                    const typeCounts: Record<string, number> = {};
                    plans.forEach(p => {
                      const key = CONTENT_TYPE_MAP[p.content_type || 'article'] || p.content_type || '文章';
                      typeCounts[key] = (typeCounts[key] || 0) + 1;
                    });
                    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
                    if (sorted.length === 0) {
                      return <p className="text-xs" style={{ color: 'var(--muted)' }}>暂无数据</p>;
                    }
                    return (
                      <div className="flex flex-wrap gap-2">
                        {sorted.map(([name, count]) => (
                          <span key={name} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--teal)', border: '1px solid rgba(45,212,191,0.2)' }}>
                            {name} · {count}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* 完成率 */}
                <div className="rounded-xl p-4" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>✅ 完成率</h4>
                  {(() => {
                    const total = plans.length;
                    const done = plans.filter(p => p.status === 'done').length;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: 'var(--muted)' }}>{done} / {total} 已完成</span>
                          <span style={{ color: 'var(--teal)' }}>{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: 'var(--ocean-deep)' }}>
                          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #10B981, #2DD4BF)' }} />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {showAdvice && (
              <div className="space-y-4">
                {/* 频率建议 */}
                <div className="rounded-xl p-4" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>📊 本月频率建议</h4>
                  <p className="text-sm" style={{ color: 'var(--teal)' }}>{advice.frequencyAdvice}</p>
                </div>

                {/* 平台建议 */}
                <div className="rounded-xl p-4" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>
                    🎯 {PLATFORM_MAP[newPlatform] || newPlatform} 发布策略
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>最佳发布时间</p>
                      <p className="text-sm font-medium mt-1" style={{ color: 'var(--ink)' }}>{advice.bestTimes.join('、')}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>推荐频率</p>
                      <p className="text-sm font-medium mt-1" style={{ color: 'var(--ink)' }}>{advice.freq}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>运营技巧</p>
                      <ul className="mt-1 space-y-1">
                        {advice.tips.map((tip, i) => (
                          <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--ink)' }}>
                            <span style={{ color: 'var(--teal)' }}>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 通用建议 */}
                <div className="rounded-xl p-4" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>💡 通用发布原则</h4>
                  <ul className="space-y-1">
                    {[
                      '保持一致的更新频率',
                      '根据数据分析调整时间',
                      '节假日前后流量特殊',
                      '系列内容固定时间发布',
                      '发布后 30 分钟内积极互动'
                    ].map((tip, i) => (
                      <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--muted)' }}>
                        <span style={{ color: 'var(--gold)' }}>✦</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 快捷操作 */}
                <div className="rounded-xl p-4" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>⚡ 快捷操作</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        // 一键生成下周发布计划
                        const today = NOW.getDate();
                        const currentMonth = NOW.getMonth();
                        const currentYear = NOW.getFullYear();
                        const platforms = ['wechat', 'xiaohongshu', 'zhihu'];
                        const titles = ['工具测评', '行业洞察', '实操教程', '热点解读', '干货分享'];

                        // 计算下周的日期范围
                        const nextWeekDates: string[] = [];
                        for (let i = 1; i <= 7; i++) {
                          const currentDate = new Date(currentYear, currentMonth, today + i);
                          const day = currentDate.getDate();
                          const m = currentDate.getMonth() + 1;
                          const y = currentDate.getFullYear();
                          nextWeekDates.push(`${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`);
                        }

                        // 防重复检测：检查下周是否已有计划
                        const existingNextWeekPlans = plans.filter(p => nextWeekDates.includes(p.date));
                        if (existingNextWeekPlans.length > 0) {
                          const overwrite = window.confirm(
                            `下周已有 ${existingNextWeekPlans.length} 个发布计划。\n点击"确定"将追加新计划（不会覆盖已有计划），点击"取消"则放弃操作。`
                          );
                          if (!overwrite) return;
                        } else {
                          // 无计划时也需要确认
                          const confirmed = window.confirm('将为您生成下周 7 天的发布计划，确认继续？');
                          if (!confirmed) return;
                        }

                        const newPlans: Plan[] = [];
                        for (let i = 1; i <= 7; i++) {
                          const currentDate = new Date(currentYear, currentMonth, today + i);
                          const day = currentDate.getDate();
                          const m = currentDate.getMonth() + 1;
                          const y = currentDate.getFullYear();
                          const platform = platforms[i % platforms.length];
                          const title = titles[i % titles.length];
                          newPlans.push({
                            date: `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
                            title: `${title} #${i}`,
                            platform,
                            content_type: 'article',
                            status: 'pending'
                          });
                        }
                        setPlans([...plans, ...newPlans]);
                        savePlans([...plans, ...newPlans]);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--teal)', border: '1px solid var(--teal)' }}
                    >
                      一键生成下周计划
                    </button>
                    <button
                      onClick={() => router.push('/optimize')}
                      className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--gold)', border: '1px solid var(--gold)' }}
                    >
                      ✍️ 去写今天的稿子
                    </button>
                  </div>
                </div>

                {/* 数据导出 */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(plans, null, 2);
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `jianjing-calendar-${year}-${String(month+1).padStart(2,'0')}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(45,212,191,0.08)', color: 'var(--teal)', border: '1px solid rgba(45,212,191,0.3)' }}
                  >
                    📥 导出本月计划 (JSON)
                  </button>
                  <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>数据来源：见鲸用户匿名共享 · 实时更新</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
