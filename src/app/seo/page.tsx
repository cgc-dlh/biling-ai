'use client';

import { useState } from 'react';
import Link from 'next/link';
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
      const res = await fetch('/api/analyze-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), keyword: keyword.trim() }),
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

  // readabilityLevel 中文映射
  const levelMap: Record<string, string> = {
    'good': '良好', 'average': '一般', 'needs improvement': '需改进',
    '良好': '良好', '一般': '一般', '需改进': '需改进',
  };

  const scoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const scoreBg = (s: number) => {
    if (s >= 80) return 'bg-green-500';
    if (s >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header current="/seo" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">SEO智能分析</h1>
          <p className="text-gray-500">AI自动分析你的内容SEO表现，给出具体优化建议</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <label className="text-sm font-semibold text-gray-700 block mb-2">📝 粘贴你需要分析的内容</label>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(''); }}
            placeholder="粘贴你的文章内容（至少50字），AI将分析关键词密度、可读性、长尾词覆盖等SEO指标..."
            className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
          />
          <div className="mt-3">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="目标关键词（可选）"
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {loading ? '🔍 AI正在分析中...' : '🔍 开始SEO分析'}
          </button>
          {error && <p className="mt-3 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
        </div>

        {report && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-5xl font-extrabold mb-2">
                <span className={scoreColor(report.overallScore)}>{report.overallScore}</span>
                <span className="text-xl text-gray-400 font-normal">/100</span>
              </div>
              <div className="text-sm text-gray-500">SEO综合评分</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${scoreBg(report.overallScore)}`} style={{ width: `${report.overallScore}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '关键词密度', value: report.keywordDensity, sub: report.keywordDensityScore === 'good' ? '✅ 优秀' : report.keywordDensityScore === 'warning' ? '⚠️ 注意' : '❌ 需优化' },
                { label: '可读性评分', value: `${report.readabilityScore}`, sub: levelMap[report.readabilityLevel] || report.readabilityLevel },
                { label: '长尾词覆盖', value: `${report.longTailCoverage}/${report.longTailTotal}`, sub: '已覆盖/总计' },
                { label: '内链建议', value: `${report.internalLinks}`, sub: report.internalLinksSuggestion },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                  <div className="text-xl font-bold text-gray-800">{item.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.sub}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">💡 优化建议</h3>
              <ul className="space-y-2">
                {report.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 mt-0.5">▸</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">📋 Meta描述建议</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{report.metaDescription}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}