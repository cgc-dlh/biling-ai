'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function Home() {
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('all');
  const [count, setCount] = useState(5);
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (content.trim().length < 10) {
      setError('请输入至少10个字的内容');
      return;
    }
    setError('');
    setLoading(true);
    setTitles([]);

    try {
      const res = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), count, style }),
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
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    return 'text-yellow-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-blue-50 border-blue-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <Header current="/" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            AI智能标题生成器
          </h1>
          <p className="text-gray-500 text-lg">
            输入你的内容，AI帮你生成高点击率标题，附带评分
          </p>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              ✍️ 粘贴你的内容或主题
            </label>
            <span className="text-xs text-gray-400">
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
            className="w-full h-36 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all"
          />

          {/* Options */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">风格：</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">数量：</label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
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
              <>
                <span>🚀</span>
                生成标题
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        {titles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              🎯 生成结果（{titles.length}个标题）
            </h2>
            <div className="space-y-3">
              {titles.map((t, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${getScoreBg(t.score)} transition-all hover:shadow-sm`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-sm text-gray-500 border border-gray-200">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {t.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-sm font-bold ${getScoreColor(t.score)}`}
                    >
                      {t.score}分
                    </span>
                    <button
                      onClick={() => handleCopy(t.title, i)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                      {copiedIdx === i ? '✅ 已复制' : '📋 复制'}
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
              className="mt-4 w-full py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
            >
              {copiedIdx === -1 ? '✅ 已复制全部标题' : '📋 一键复制全部标题'}
            </button>
          </div>
        )}

        {/* Feature preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📊', title: 'SEO智能分析', desc: '分析关键词，优化排名', color: 'bg-emerald-50 border-emerald-200', href: '/seo' },
            { icon: '🔄', title: '内容优化', desc: '多平台适配+审校', color: 'bg-purple-50 border-purple-200', href: '/optimize' },
            { icon: '🚀', title: '更多功能', desc: '开发中...', color: 'bg-orange-50 border-orange-200', href: '#' },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className={`${f.color} border rounded-xl p-4 text-center block hover:shadow-md transition-shadow no-underline`}
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="font-semibold text-sm text-gray-700">{f.title}</div>
              <div className="text-xs text-gray-400 mt-1">{f.desc}</div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}