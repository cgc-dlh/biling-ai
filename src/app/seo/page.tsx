'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SEOReport {
  keywordDensity: string;
  keywordDensityScore: string;
  readabilityScore: number;
  readabilityLevel: string;
  longTailCoverage: number;
  longTailTotal: number;
  internalLinks: number;
  internalLinksSuggestion: string;
  titleOptimization: string;
  metaDescription: string;
  suggestions: string[];
  overallScore: number;
}

export default function SEOPage() {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [report, setReport] = useState<SEOReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (content.trim().length < 50) {
      setError('请至少输入50字的内容');
      return;
    }
    setError('');
    setLoading(true);
    setReport(null);

    try {
      let brand = undefined;
      try { brand = JSON.parse(localStorage.getItem('jianjing_brand_profile') || 'null'); } catch { /* ignore */ }

      const res = await fetch('/api/analyze-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), keyword: keyword.trim(), brand }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '分析失败');
      } else {
        setReport(data);
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const levelMap: Record<string, string> = {
    'good': '良好', 'average': '一般', 'needs improvement': '需改进',
    '良好': '良好', '一般': '一般', '需改进': '需改进',
  };

  const scoreColor = (s: number) => s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444';
  const scoreBg = (s: number) => s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <Header current="/seo" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>SEO智能分析</h1>
          <p style={{ color: 'var(--muted)' }}>AI自动分析你的内容SEO表现，给出具体优化建议</p>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--ink)' }}>粘贴你需要分析的内容</label>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(''); }}
            placeholder="粘贴你的文章内容（至少50字），AI将分析关键词密度、可读性、长尾词覆盖等SEO指标..."
            className="w-full h-40 p-4 rounded-xl resize-none text-base"
            style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
          />
          <div className="mt-3">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="目标关键词（可选）"
              className="w-full p-2.5 rounded-lg text-sm"
              style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ background: 'var(--teal)' }}
          >
            {loading ? 'AI正在分析中...' : '开始SEO分析'}
          </button>
          {error && <p className="mt-3 text-sm px-4 py-2 rounded-lg" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)' }}>{error}</p>}
        </div>

        {report && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
              <div className="text-5xl font-extrabold mb-2" style={{ color: scoreColor(report.overallScore) }}>{report.overallScore}<span className="text-xl font-normal" style={{ color: 'var(--muted)' }}>/100</span></div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>SEO综合评分</div>
              <div className="mt-2 w-full rounded-full h-2.5" style={{ background: 'var(--ocean-deep)' }}>
                <div className="h-2.5 rounded-full" style={{ width: `${report.overallScore}%`, background: scoreBg(report.overallScore) }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '关键词密度', value: report.keywordDensity, sub: report.keywordDensityScore === 'good' ? '优秀' : report.keywordDensityScore === 'warning' ? '注意' : '需优化' },
                { label: '可读性评分', value: `${report.readabilityScore}`, sub: levelMap[report.readabilityLevel] || report.readabilityLevel },
                { label: '长尾词覆盖', value: `${report.longTailCoverage}/${report.longTailTotal}`, sub: '已覆盖/总计' },
                { label: '内链建议', value: `${report.internalLinks}`, sub: report.internalLinksSuggestion },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-4 text-center" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{item.label}</div>
                  <div className="text-xl font-bold" style={{ color: 'var(--ink)' }}>{item.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{item.sub}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="font-bold mb-3" style={{ color: 'var(--ink)' }}>优化建议</h3>
              <ul className="space-y-2">
                {report.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ink)' }}>
                    <span style={{ color: 'var(--teal)' }}>▸</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="font-bold mb-3" style={{ color: 'var(--ink)' }}>Meta描述建议</h3>
              <p className="text-sm p-4 rounded-lg" style={{ background: 'var(--ocean-deep)', color: 'var(--muted)' }}>{report.metaDescription}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
