'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WelcomeGuide from '@/components/WelcomeGuide';

interface Title {
  title: string;
  score: number;
}

const STYLE_OPTIONS = [
  { value: 'all', label: '全部风格', desc: '综合多种风格' },
  { value: 'suspense', label: '悬念型', desc: '引发好奇心' },
  { value: 'number', label: '数字型', desc: '具体数字吸引点击' },
  { value: 'pain', label: '痛点型', desc: '直击用户痛点' },
  { value: 'story', label: '故事型', desc: '用故事引发共鸣' },
  { value: 'compare', label: '对比型', desc: '前后对比制造冲击' },
];

// localStorage key
const LAB_KEY = 'jianjing_lab_favorites';

function loadFavorites(): Title[] {
  try { return JSON.parse(localStorage.getItem(LAB_KEY) || '[]'); } catch { return []; }
}

function saveFavorites(favs: Title[]) {
  localStorage.setItem(LAB_KEY, JSON.stringify(favs));
}

export default function Home() {
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('all');
  const [count, setCount] = useState(5);
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Title[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setFavorites(loadFavorites()); }, []);

  const isFaved = useCallback((t: Title) => {
    return favorites.some(f => f.title === t.title);
  }, [favorites]);

  const toggleFav = useCallback((t: Title) => {
    const next = isFaved(t)
      ? favorites.filter(f => f.title !== t.title)
      : [...favorites, t];
    setFavorites(next);
    saveFavorites(next);
  }, [favorites, isFaved]);

  const handleGenerate = async () => {
    if (content.trim().length < 10) {
      setError('请输入至少10个字的内容');
      return;
    }
    setError('');
    setLoading(true);
    setTitles([]);

    try {
      // 读取品牌信息
      let brand = undefined;
      try { brand = JSON.parse(localStorage.getItem('jianjing_brand_profile') || 'null'); } catch { /* ignore */ }

      const res = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), count, style, brand }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '生成失败，请重试');
      } else {
        setTitles(data.titles || []);
      }
    } catch {
      setError('网络错误，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
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
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#2DD4BF';
    return '#F59E0B';
  };

  const bgStyle = (score: number): React.CSSProperties => ({
    background: score >= 85 ? 'rgba(16,185,129,0.08)' : score >= 70 ? 'rgba(45,212,191,0.08)' : 'rgba(245,158,11,0.08)',
    border: `1px solid ${score >= 85 ? 'rgba(16,185,129,0.2)' : score >= 70 ? 'rgba(45,212,191,0.2)' : 'rgba(245,158,11,0.2)'}`,
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <WelcomeGuide />
      <Header current="/" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>
            <span style={{ color: 'var(--teal)' }}>见鲸</span> · AI智能标题生成器
          </h1>
          <p className="text-lg mb-4" style={{ color: 'var(--muted)' }}>
            输入内容，AI生成高点击率标题 · 支持6种风格
          </p>
          {/* 一键体验 */}
          <button
            onClick={async () => {
              const demo = '做了3年自媒体，我终于摸索出一套内容创作方法论。从选题、标题到发布，每个环节都有技巧。选题要追热点也要有积累，标题要有悬念也要真实，多平台发布要适配各平台风格。今天全部分享给大家。';
              setContent(demo);
              setError('');
              setLoading(true);
              setTitles([]);
              try {
                let brand = undefined;
                try { brand = JSON.parse(localStorage.getItem('jianjing_brand_profile') || 'null'); } catch { /* ignore */ }
                const res = await fetch('/api/generate-titles', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ content: demo, count: 5, style: 'all', brand }),
                });
                const data = await res.json();
                if (!res.ok) setError(data.error || '生成失败');
                else setTitles(data.titles || []);
              } catch { setError('网络错误'); }
              finally { setLoading(false); }
              setTimeout(() => {
                const el = document.querySelector('textarea');
                if (el) el.focus();
              }, 500);
            }}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--gold), #F97316)', color: '#0A1929' }}
          >
            一键体验 · 立看效果
          </button>
        </div>

        {/* Input Area */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              粘贴你的内容或主题
            </label>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {content.length} 字
            </span>
          </div>
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError('');
            }}
            placeholder="例如：做了3年自媒体，我终于摸索出一套内容创作方法论，从选题、标题到发布，每个环节都有技巧，今天全部分享给大家..."
            className="w-full h-36 p-4 rounded-xl resize-none transition-all text-base"
            style={{
              background: 'var(--ocean-deep)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />

          {/* Options */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm" style={{ color: 'var(--muted)' }}>风格：</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="text-sm rounded-lg px-3 py-1.5"
                style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)' }}
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm" style={{ color: 'var(--muted)' }}>数量：</label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="text-sm rounded-lg px-3 py-1.5"
                style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)' }}
              >
                {[3, 5, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} 个
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            style={{ background: loading ? 'var(--ocean-surface)' : 'linear-gradient(135deg, var(--teal), #0EA5E9)' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI正在生成中...
              </>
            ) : (
              '生成标题'
            )}
          </button>

          {error && (
            <p className="mt-3 text-sm px-4 py-2 rounded-lg" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        {titles.length > 0 && (
          <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)' }}>
              {titles.length} 个标题
            </h2>
            <div className="space-y-3">
              {titles.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all"
                  style={bgStyle(t.score)}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--ocean-deep)', color: getScoreColor(t.score), border: '1px solid var(--border-subtle)' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium leading-relaxed" style={{ color: 'var(--ink)' }}>
                      {t.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold" style={{ color: getScoreColor(t.score) }}>
                      {t.score}分
                    </span>
                    <button
                      onClick={() => toggleFav(t)}
                      className="px-2 py-1 text-sm rounded-lg transition-colors"
                      style={{ color: isFaved(t) ? 'var(--gold)' : 'var(--muted)' }}
                      title={isFaved(t) ? '取消收藏' : '收藏到实验室'}
                    >
                      {isFaved(t) ? '★' : '☆'}
                    </button>
                    <button
                      onClick={() => handleCopy(t.title, i)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--muted)' }}
                    >
                      {copiedIdx === i ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Copy All */}
            <button
              onClick={() => {
                const all = titles.map((t) => t.title).join('\n');
                handleCopy(all, -1);
              }}
              className="mt-4 w-full py-2.5 text-sm font-medium rounded-xl transition-colors"
              style={{ border: '1px solid var(--border-subtle)', color: 'var(--teal)' }}
            >
              {copiedIdx === -1 ? '已复制全部标题' : '一键复制全部标题'}
            </button>
          </div>
        )}

        {/* Feature preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'SEO分析', title: 'SEO智能分析', desc: '关键词密度+可读性评估', href: '/seo', accent: 'var(--teal)' },
            { icon: '内容优化', title: '多平台适配', desc: '一篇变17平台版本', href: '/optimize', accent: 'var(--teal-glow)' },
            { icon: '实验室', title: '爆款实验室', desc: '收藏+排行+对比', href: '/lab', accent: 'var(--gold)' },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="rounded-xl p-4 text-center block transition-all no-underline hover:shadow-lg"
              style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xl mb-1 font-bold" style={{ color: f.accent }}>{f.icon}</div>
              <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{f.title}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{f.desc}</div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
