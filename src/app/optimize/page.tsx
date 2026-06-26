'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 审校错误项接口
interface ProofreadError {
  type: string;
  original: string;
  suggestion: string;
  position: string;
}

// 审校警告项接口
interface ProofreadWarning {
  type: string;
  detail: string;
}

// 审校统计接口
interface ProofreadStats {
  totalChars: number;
  errorCount: number;
  warningCount: number;
}

// 审校结果接口
interface ProofreadResult {
  overallRating: string;
  stats: ProofreadStats | null;
  errors: ProofreadError[];
  warnings: ProofreadWarning[];
}

const PLATFORMS = [
  { value: 'wechat', label: '公众号', icon: '📱' },
  { value: 'xiaohongshu', label: '小红书', icon: '📕' },
  { value: 'zhihu', label: '知乎', icon: '💡' },
  { value: 'toutiao', label: '头条号', icon: '📰' },
  { value: 'baijia', label: '百家号', icon: '📝' },
];

export default function OptimizePage() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('wechat');
  const [action, setAction] = useState<'adapt' | 'proofread'>('adapt');
  const [result, setResult] = useState<string>('');
  const [proofreadResult, setProofreadResult] = useState<ProofreadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (content.trim().length < 30) {
      setError('请至少输入30字的内容');
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    setProofreadResult(null);

    try {
      const res = await fetch('/api/optimize-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), platform, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '处理失败');
      } else if (action === 'adapt') {
        setResult(data.content);
      } else {
        setProofreadResult(data);
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header current="/optimize" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">内容优化 & 审校</h1>
          <p className="text-gray-500">多平台一键适配，AI智能审校，确保内容质量</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Action toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setAction('adapt'); setResult(''); setProofreadResult(null); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${action === 'adapt' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              多平台适配
            </button>
            <button
              onClick={() => { setAction('proofread'); setResult(''); setProofreadResult(null); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${action === 'proofread' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              AI智能审校
            </button>
          </div>

          {/* Platform selector (only for adapt) */}
          {action === 'adapt' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${platform === p.value ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          )}

          <label className="text-sm font-semibold text-gray-700 block mb-2">
            {action === 'adapt' ? '📝 粘贴原始内容' : '📝 粘贴需要审校的内容'}
          </label>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(''); }}
            placeholder={action === 'adapt' ? '粘贴你的原文，AI将自动适配为目标平台格式...' : '粘贴需要审校的内容，AI将检测错别字、语法错误、文风问题...'}
            className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleOptimize}
            disabled={loading}
            className={`mt-4 w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm ${action === 'adapt' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600' : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'}`}
          >
            {loading ? '⏳ AI处理中...' : action === 'adapt' ? '🔄 开始适配' : '✅ 开始审校'}
          </button>
          {error && <p className="mt-3 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
        </div>

        {/* Adapt result */}
        {result && action === 'adapt' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">✅ 适配结果</h3>
              <button
                onClick={() => handleCopy(result)}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {copied ? '✅ 已复制' : '📋 复制内容'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
              {result}
            </div>
          </div>
        )}

        {/* Proofread result */}
        {proofreadResult && action === 'proofread' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <span className="text-4xl font-extrabold text-purple-600">{proofreadResult.overallRating}</span>
              <div className="text-sm text-gray-500 mt-1">
                {proofreadResult.stats?.totalChars || 0}字 · {proofreadResult.stats?.errorCount || 0}个错误 · {proofreadResult.stats?.warningCount || 0}个警告
              </div>
            </div>

            {proofreadResult.errors?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
                <h3 className="font-bold text-red-600 mb-3">❌ 发现 {proofreadResult.errors.length} 个错误</h3>
                {proofreadResult.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0 text-sm">
                    <span className="text-red-500 font-medium whitespace-nowrap">{err.type}</span>
                    <span className="text-red-400 line-through">{err.original}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600 font-medium">{err.suggestion}</span>
                    <span className="text-gray-400 ml-auto text-xs">{err.position}</span>
                  </div>
                ))}
              </div>
            )}

            {proofreadResult.warnings?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-6">
                <h3 className="font-bold text-yellow-600 mb-3">⚠️ {proofreadResult.warnings.length} 个提醒</h3>
                {proofreadResult.warnings.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 text-sm text-gray-700">
                    <span className="text-yellow-500">▸</span>
                    <span className="font-medium text-yellow-600">{w.type}</span>
                    <span>{w.detail}</span>
                  </div>
                ))}
              </div>
            )}

            {(!proofreadResult.errors || proofreadResult.errors.length === 0) && (!proofreadResult.warnings || proofreadResult.warnings.length === 0) && (
              <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="font-bold text-green-600">内容完美，未发现问题！</div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}