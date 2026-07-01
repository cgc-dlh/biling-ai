'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { loadTrendingTitles, type TrendingTitle } from '@/lib/trending';

interface Favorite {
  title: string;
  score: number;
  platform: string;
  style: string;
  savedAt?: number;
}

const LAB_KEY = 'jianjing_lab_favorites';

function loadFavorites(): Favorite[] {
  try {
    const items: Favorite[] = JSON.parse(localStorage.getItem(LAB_KEY) || '[]');
    // 给没有 savedAt 的旧数据补充递增时间戳，模拟保存顺序
    items.forEach((item, i) => {
      if (!item.savedAt) item.savedAt = Date.now() - (items.length - i);
    });
    return items;
  } catch { return []; }
}

function saveFavorites(favs: Favorite[]) {
  localStorage.setItem(LAB_KEY, JSON.stringify(favs));
}

export default function LabPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'time'>('score');
  const [activeTab, setActiveTab] = useState<'mine' | 'trending'>('mine');
  const [newTitle, setNewTitle] = useState('');
  const [newScore, setNewScore] = useState(80);
  const [newPlatform, setNewPlatform] = useState('公众号');
  const [newStyle, setNewStyle] = useState('综合型');
  const [showForm, setShowForm] = useState(false);
  const [trending, setTrending] = useState<TrendingTitle[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [confirmAction, setConfirmAction] = useState<{message: string, onConfirm: () => void} | null>(null);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  useEffect(() => {
    if (activeTab === 'trending') {
      setLoadingTrending(true);
      loadTrendingTitles().then(data => {
        setTrending(data);
        setLoadingTrending(false);
      });
    }
  }, [activeTab]);

  const sorted = sortBy === 'score'
    ? [...favorites].sort((a, b) => b.score - a.score)
    : [...favorites].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));

  const remove = (idx: number) => {
    const next = favorites.filter((_, i) => i !== idx);
    setFavorites(next);
    saveFavorites(next);
  };

  const clearAll = () => {
    setFavorites([]);
    saveFavorites([]);
  };

  const addManualTitle = () => {
    if (!newTitle.trim()) return;
    const fav: Favorite = {
      title: newTitle.trim(),
      score: newScore,
      platform: newPlatform,
      style: newStyle,
      savedAt: Date.now(),
    };
    const next = [fav, ...favorites];
    setFavorites(next);
    saveFavorites(next);
    setNewTitle('');
    setShowForm(false);
  };

  const shareTitle = async (t: Favorite) => {
    const text = `【见鲸爆款标题】${t.title} — 预估评分:${t.score}分`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setToast({message: '已复制到剪贴板', type: 'success'});
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#2DD4BF';
    return '#F59E0B';
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <Header current="/lab" />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>爆款实验室</h1>
          <p style={{ color: 'var(--muted)' }}>收藏的标题在这里对比排行，找到你的爆款公式</p>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('mine')}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === 'mine' ? 'var(--teal)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'mine' ? '#fff' : 'var(--muted)',
            }}
          >
            ⭐ 我的收藏 ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === 'trending' ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'trending' ? '#fff' : 'var(--muted)',
            }}
          >
            🔥 热门排行
          </button>
        </div>

        {/* 我的收藏 */}
        {activeTab === 'mine' && (
          <>
            {favorites.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                <div className="text-5xl mb-4">☆</div>
                <p className="text-lg font-semibold mb-1" style={{ color: 'var(--ink)' }}>还没有收藏标题</p>
                <p style={{ color: 'var(--muted)' }}>
                  去 <a href="/" style={{ color: 'var(--teal)' }}>标题生成</a> 页面，点击星标收藏你喜欢的标题
                </p>
              </div>
            ) : (
              <>
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('score')}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: sortBy === 'score' ? 'rgba(45,212,191,0.12)' : 'var(--ocean-surface)',
                        color: sortBy === 'score' ? 'var(--teal)' : 'var(--muted)',
                        border: `1px solid ${sortBy === 'score' ? 'var(--teal)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      按评分
                    </button>
                    <button
                      onClick={() => setSortBy('time')}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: sortBy === 'time' ? 'rgba(45,212,191,0.12)' : 'var(--ocean-surface)',
                        color: sortBy === 'time' ? 'var(--teal)' : 'var(--muted)',
                        border: `1px solid ${sortBy === 'time' ? 'var(--teal)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      按时间
                    </button>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: 'var(--teal)', background: 'rgba(45,212,191,0.08)', border: '1px solid var(--teal)' }}
                  >
                    + 手动添加
                  </button>
                  <button
                    onClick={() => setConfirmAction({message: '确定清空所有收藏？', onConfirm: clearAll})}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    清空全部
                  </button>
                </div>

                {/* 手动添加表单 */}
                {showForm && (
                  <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="输入标题"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="px-3 py-2 rounded-lg border text-sm"
                        style={{ border: '1px solid var(--border-subtle)', background: '#fff' }}
                      />
                      <input
                        type="number"
                        placeholder="评分"
                        value={newScore}
                        onChange={(e) => setNewScore(Number(e.target.value))}
                        className="px-3 py-2 rounded-lg border text-sm"
                        style={{ border: '1px solid var(--border-subtle)', background: '#fff' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        className="px-3 py-2 rounded-lg border text-sm"
                        style={{ border: '1px solid var(--border-subtle)', background: '#fff' }}
                      >
                        <option>公众号</option>
                        <option>小红书</option>
                        <option>知乎</option>
                        <option>头条</option>
                        <option>B站</option>
                        <option>微博</option>
                      </select>
                      <select
                        value={newStyle}
                        onChange={(e) => setNewStyle(e.target.value)}
                        className="px-3 py-2 rounded-lg border text-sm"
                        style={{ border: '1px solid var(--border-subtle)', background: '#fff' }}
                      >
                        <option>综合型</option>
                        <option>悬念型</option>
                        <option>数字型</option>
                        <option>痛点型</option>
                        <option>故事型</option>
                        <option>对比型</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addManualTitle}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ background: 'var(--teal)', color: '#fff' }}
                      >
                        添加收藏
                      </button>
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 rounded-lg text-sm"
                        style={{ color: 'var(--muted)', background: 'transparent' }}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}

                {/* List */}
                <div className="space-y-3">
                  {sorted.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ color: getScoreColor(t.score), background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium" style={{ color: 'var(--ink)' }}>{t.title}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--teal)' }}>{t.platform}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>{t.style}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold flex-shrink-0" style={{ color: getScoreColor(t.score) }}>{t.score}分</span>
                      <button onClick={() => shareTitle(t)} className="px-2 py-1 text-xs rounded-lg transition-colors flex-shrink-0" style={{ color: 'var(--muted)', border: '1px solid var(--border-subtle)' }} title="分享">分享</button>
                      <button onClick={() => setConfirmAction({message: '确定删除这条收藏？', onConfirm: () => remove(i)})} className="text-xs flex-shrink-0 px-2 py-1 rounded-lg transition-colors" style={{ color: '#EF4444' }}>删除</button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>共 {favorites.length} 条收藏</span>
                </div>
              </>
            )}
          </>
        )}

        {/* 热门排行 */}
        {activeTab === 'trending' && (
          <div className="space-y-3">
            {loadingTrending ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>加载热门数据中...</p>
              </div>
            ) : (
              <>
                {trending.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ color: i < 3 ? '#FFD700' : getScoreColor(t.score), background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium" style={{ color: 'var(--ink)' }}>{t.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--teal)' }}>{t.platform}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>{t.style}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>🔥 {t.shares} 分享</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: getScoreColor(t.score) }}>{t.score}分</span>
                  </div>
                ))}
                <div className="mt-6 text-center">
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>数据来源：见鲸用户匿名共享 · 实时更新</p>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg z-50 transition-opacity"
          style={{ background: toast.type === 'success' ? '#10B981' : '#2DD4BF', color: '#0A1929' }}
          onClick={() => setToast(null)}
        >
          {toast.message}
        </div>
      )}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setConfirmAction(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm mb-4" style={{ color: 'var(--ink)' }}>{confirmAction.message}</p>
            <div className="flex gap-2">
              <button onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--teal)', color: '#0A1929' }}>确认</button>
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--muted)', background: 'transparent' }}>取消</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
