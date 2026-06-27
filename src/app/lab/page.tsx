'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Favorite {
  title: string;
  score: number;
}

const LAB_KEY = 'jianjing_lab_favorites';

function loadFavorites(): Favorite[] {
  try { return JSON.parse(localStorage.getItem(LAB_KEY) || '[]'); } catch { return []; }
}

function saveFavorites(favs: Favorite[]) {
  localStorage.setItem(LAB_KEY, JSON.stringify(favs));
}

export default function LabPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'time'>('score');

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const sorted = sortBy === 'score'
    ? [...favorites].sort((a, b) => b.score - a.score)
    : favorites;

  const remove = (idx: number) => {
    const next = favorites.filter((_, i) => i !== idx);
    setFavorites(next);
    saveFavorites(next);
  };

  const clearAll = () => {
    if (confirm('确定清空所有收藏？')) {
      setFavorites([]);
      saveFavorites([]);
    }
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
    alert('已复制到剪贴板！');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <Header current="/lab" />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>爆款实验室</h1>
          <p style={{ color: 'var(--muted)' }}>收藏的标题在这里对比排行，找到你的爆款公式</p>
        </div>

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
            <div className="flex items-center justify-between mb-4">
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
                onClick={clearAll}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                清空全部
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {sorted.map((t, i) => {
                const scoreColor = t.score >= 85 ? '#10B981' : t.score >= 70 ? '#2DD4BF' : '#F59E0B';
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ color: scoreColor, background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium" style={{ color: 'var(--ink)' }}>{t.title}</p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: scoreColor }}>{t.score}分</span>
                    <button
                      onClick={() => shareTitle(t)}
                      className="px-2 py-1 text-xs rounded-lg transition-colors flex-shrink-0"
                      style={{ color: 'var(--muted)', border: '1px solid var(--border-subtle)' }}
                      title="分享"
                    >
                      分享
                    </button>
                    <button
                      onClick={() => remove(i)}
                      className="text-xs flex-shrink-0 px-2 py-1 rounded-lg transition-colors"
                      style={{ color: '#EF4444' }}
                    >
                      删除
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>共 {favorites.length} 条收藏</span>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
