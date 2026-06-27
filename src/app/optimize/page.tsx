'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ProofreadError {
  type: string;
  original: string;
  suggestion: string;
  position: string;
}

interface ProofreadWarning {
  type: string;
  detail: string;
}

interface ProofreadStats {
  totalChars: number;
  errorCount: number;
  warningCount: number;
}

interface ProofreadResult {
  overallRating: string;
  stats: ProofreadStats | null;
  errors: ProofreadError[];
  warnings: ProofreadWarning[];
}

interface PlatformResult {
  platform: string;
  label: string;
  content: string;
  loading: boolean;
  error?: string;
}

const PLATFORMS = [
  { value: 'wechat', label: '公众号' },
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'zhihu', label: '知乎' },
  { value: 'toutiao', label: '头条号' },
  { value: 'baijia', label: '百家号' },
  { value: 'douyin', label: '抖音' },
  { value: 'bilibili', label: 'B站' },
  { value: 'weibo', label: '微博' },
  { value: 'kuaishou', label: '快手' },
];

export default function OptimizePage() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('wechat');
  const [action, setAction] = useState<'adapt' | 'proofread' | 'batch'>('adapt');
  const [result, setResult] = useState<string>('');
  const [proofreadResult, setProofreadResult] = useState<ProofreadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Batch mode
  const [batchPlatforms, setBatchPlatforms] = useState<Set<string>>(new Set());
  const [batchResults, setBatchResults] = useState<PlatformResult[]>([]);
  const [batchActiveTab, setBatchActiveTab] = useState(0);
  const [batchRunning, setBatchRunning] = useState(false);

  const toggleBatchPlatform = (v: string) => {
    setBatchPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v); else next.add(v);
      return next;
    });
  };

  const selectAllPlatforms = () => setBatchPlatforms(new Set(PLATFORMS.map(p => p.value)));
  const deselectAllPlatforms = () => setBatchPlatforms(new Set());

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
      let brand = undefined;
      try { brand = JSON.parse(localStorage.getItem('jianjing_brand_profile') || 'null'); } catch { /* ignore */ }

      const res = await fetch('/api/optimize-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), platform, action, brand }),
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

  const handleBatchGenerate = async () => {
    if (content.trim().length < 30) { setError('请至少输入30字'); return; }
    if (batchPlatforms.size === 0) { setError('请至少选择1个平台'); return; }
    setError('');
    setBatchRunning(true);

    let brand = undefined;
    try { brand = JSON.parse(localStorage.getItem('jianjing_brand_profile') || 'null'); } catch { /* ignore */ }

    const selected = PLATFORMS.filter(p => batchPlatforms.has(p.value));
    const initial: PlatformResult[] = selected.map(s => ({
      platform: s.value, label: s.label, content: '', loading: true,
    }));
    setBatchResults(initial);
    setBatchActiveTab(0);

    // 依次调用，避免 rate limit
    for (let i = 0; i < selected.length; i++) {
      try {
        const res = await fetch('/api/optimize-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: content.trim(), platform: selected[i].value, action: 'adapt', brand }),
        });
        const data = await res.json();
        setBatchResults(prev => prev.map((r, idx) => idx === i
          ? { ...r, content: data.error ? '' : (data.content || ''), error: data.error, loading: false }
          : r));
      } catch {
        setBatchResults(prev => prev.map((r, idx) => idx === i
          ? { ...r, content: '', error: '网络错误', loading: false }
          : r));
      }
    }
    setBatchRunning(false);
  };

  const handleCopy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <Header current="/optimize" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>内容优化 & 审校</h1>
          <p style={{ color: 'var(--muted)' }}>多平台一键适配，AI智能审校，确保内容质量</p>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          {/* Action tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['adapt', 'proofread', 'batch'] as const).map(a => (
              <button
                key={a}
                onClick={() => { setAction(a); setResult(''); setProofreadResult(null); setBatchResults([]); }}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: action === a ? (a === 'batch' ? 'var(--gold)' : a === 'proofread' ? '#8B5CF6' : 'var(--teal)') : 'var(--ocean-deep)',
                  color: action === a ? '#0A1929' : 'var(--muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {a === 'adapt' ? '单平台适配' : a === 'proofread' ? '智能审校' : '一键全平台'}
              </button>
            ))}
          </div>

          {/* Platform selector for adapt */}
          {action === 'adapt' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: platform === p.value ? 'rgba(45,212,191,0.12)' : 'var(--ocean-deep)',
                    color: platform === p.value ? 'var(--teal)' : 'var(--muted)',
                    border: `1px solid ${platform === p.value ? 'var(--teal)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Platform checkboxes for batch */}
          {action === 'batch' && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={selectAllPlatforms} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--teal)', border: '1px solid var(--border-subtle)' }}>全选</button>
                <button onClick={deselectAllPlatforms} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--muted)', border: '1px solid var(--border-subtle)' }}>取消</button>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>已选 {batchPlatforms.size}/{PLATFORMS.length} 个平台</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => {
                  const sel = batchPlatforms.has(p.value);
                  return (
                    <button
                      key={p.value}
                      onClick={() => toggleBatchPlatform(p.value)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: sel ? 'rgba(245,158,11,0.12)' : 'var(--ocean-deep)',
                        color: sel ? 'var(--gold)' : 'var(--muted)',
                        border: `1px solid ${sel ? 'var(--gold)' : 'var(--border-subtle)'}`,
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--ink)' }}>
            {action === 'proofread' ? '粘贴需要审校的内容' : '粘贴原始内容'}
          </label>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(''); }}
            placeholder={action === 'batch' ? '粘贴一篇内容，一键生成多平台版本...' : action === 'adapt' ? '粘贴原文，AI将自动适配为目标平台格式...' : '粘贴需要审校的内容，AI将检测错别字、语法错误...'}
            className="w-full h-40 p-4 rounded-xl resize-none text-base"
            style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
          />

          {action === 'batch' ? (
            <button
              onClick={handleBatchGenerate}
              disabled={batchRunning}
              className="mt-4 w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ background: batchRunning ? 'var(--ocean-surface)' : 'var(--gold)', color: batchRunning ? 'var(--muted)' : '#0A1929' }}
            >
              {batchRunning ? 'AI正在依次生成各平台...' : `一键生成${batchPlatforms.size}个平台版本`}
            </button>
          ) : (
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="mt-4 w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ background: action === 'adapt' ? 'var(--teal)' : '#8B5CF6' }}
            >
              {loading ? 'AI处理中...' : action === 'adapt' ? '开始适配' : '开始审校'}
            </button>
          )}
          {error && <p className="mt-3 text-sm px-4 py-2 rounded-lg" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)' }}>{error}</p>}
        </div>

        {/* Adapt result */}
        {result && action === 'adapt' && (
          <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold" style={{ color: 'var(--ink)' }}>适配结果</h3>
              <button
                onClick={() => handleCopy(result)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--teal)' }}
              >
                {copied ? '已复制' : '复制内容'}
              </button>
            </div>
            <div className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed text-sm" style={{ background: 'var(--ocean-deep)', color: 'var(--ink)' }}>
              {result}
            </div>
          </div>
        )}

        {/* Batch results */}
        {batchResults.length > 0 && action === 'batch' && (
          <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="font-bold mb-3" style={{ color: 'var(--ink)' }}>全平台生成结果</h3>
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 mb-4">
              {batchResults.map((r, i) => (
                <button
                  key={r.platform}
                  onClick={() => setBatchActiveTab(i)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                  style={{
                    background: batchActiveTab === i ? 'rgba(45,212,191,0.12)' : 'var(--ocean-deep)',
                    color: batchActiveTab === i ? 'var(--teal)' : 'var(--muted)',
                    border: `1px solid ${batchActiveTab === i ? 'var(--teal)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {r.loading ? '⏳' : r.error ? '❌' : '✅'} {r.label}
                </button>
              ))}
            </div>
            {/* Active tab content */}
            {batchResults[batchActiveTab] && (
              <div>
                {batchResults[batchActiveTab].loading ? (
                  <div className="text-center py-8" style={{ color: 'var(--muted)' }}>正在生成中...</div>
                ) : batchResults[batchActiveTab].error ? (
                  <div className="text-center py-4" style={{ color: '#EF4444' }}>{batchResults[batchActiveTab].error}</div>
                ) : (
                  <>
                    <div className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed text-sm mb-3" style={{ background: 'var(--ocean-deep)', color: 'var(--ink)' }}>
                      {batchResults[batchActiveTab].content}
                    </div>
                    <button
                      onClick={() => handleCopy(batchResults[batchActiveTab].content)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--teal)' }}
                    >
                      复制当前平台内容
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Proofread result */}
        {proofreadResult && action === 'proofread' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)' }}>
              <span className="text-4xl font-extrabold" style={{ color: '#8B5CF6' }}>{proofreadResult.overallRating}</span>
              <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                {proofreadResult.stats?.totalChars || 0}字 · {proofreadResult.stats?.errorCount || 0}个错误 · {proofreadResult.stats?.warningCount || 0}个警告
              </div>
            </div>

            {proofreadResult.errors?.length > 0 && (
              <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <h3 className="font-bold mb-3" style={{ color: '#EF4444' }}>发现 {proofreadResult.errors.length} 个错误</h3>
                {proofreadResult.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 text-sm" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <span className="font-medium whitespace-nowrap" style={{ color: '#EF4444' }}>{err.type}</span>
                    <span style={{ color: '#EF4444', textDecoration: 'line-through' }}>{err.original}</span>
                    <span style={{ color: 'var(--muted)' }}>→</span>
                    <span className="font-medium" style={{ color: '#10B981' }}>{err.suggestion}</span>
                    <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>{err.position}</span>
                  </div>
                ))}
              </div>
            )}

            {proofreadResult.warnings?.length > 0 && (
              <div className="rounded-2xl p-6" style={{ background: 'var(--ocean-surface)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <h3 className="font-bold mb-3" style={{ color: 'var(--gold)' }}>{proofreadResult.warnings.length} 个提醒</h3>
                {proofreadResult.warnings.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 text-sm" style={{ color: 'var(--ink)' }}>
                    <span style={{ color: 'var(--gold)' }}>▸</span>
                    <span className="font-medium" style={{ color: 'var(--gold)' }}>{w.type}</span>
                    <span>{w.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
