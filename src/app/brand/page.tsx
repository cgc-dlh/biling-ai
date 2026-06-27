'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const BRAND_KEY = 'jianjing_brand_profile';

export interface BrandProfile {
  track: string;
  persona: string;
  toneTags: string[];
  forbiddenWords: string;
  sampleTexts: string[];
}

const TRACKS = ['科技', '美妆', '教育', '职场', '财经', '生活', '娱乐', '其他'];
const PERSONAS = ['专家型', '体验型', '故事型', '数据型', '幽默型'];
const TONE_OPTIONS = ['口语化', '正式', '温暖', '犀利', '极简', '活泼', '深度'];

function loadProfile(): BrandProfile {
  try {
    return JSON.parse(localStorage.getItem(BRAND_KEY) || '{}');
  } catch {
    return {} as BrandProfile;
  }
}

function saveProfile(p: BrandProfile) {
  localStorage.setItem(BRAND_KEY, JSON.stringify(p));
}

export default function BrandPage() {
  const [profile, setProfile] = useState<BrandProfile>({ track: '', persona: '', toneTags: [], forbiddenWords: '', sampleTexts: [] });
  const [saved, setSaved] = useState(false);
  const [sampleInput, setSampleInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setProfile(loadProfile());
  }, [router]);

  const update = (partial: Partial<BrandProfile>) => {
    setProfile(prev => ({ ...prev, ...partial }));
    setSaved(false);
  };

  const handleSave = () => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSample = () => {
    if (sampleInput.trim().length < 20) return;
    update({ sampleTexts: [...(profile.sampleTexts || []), sampleInput.trim()] });
    setSampleInput('');
  };

  const removeSample = (idx: number) => {
    const next = (profile.sampleTexts || []).filter((_, i) => i !== idx);
    update({ sampleTexts: next });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)' }}>
      <Header current="/brand" />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ink)' }}>我的品牌</h1>
          <p style={{ color: 'var(--muted)' }}>设置一次，每次AI生成都会自动带入你的品牌风格</p>
        </div>

        <div className="rounded-2xl p-6 space-y-6" style={{ background: 'var(--ocean-surface)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          {/* Track */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>赛道</label>
            <div className="flex flex-wrap gap-2">
              {TRACKS.map(t => (
                <button
                  key={t}
                  onClick={() => update({ track: t })}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: profile.track === t ? 'rgba(45,212,191,0.12)' : 'var(--ocean-deep)',
                    color: profile.track === t ? 'var(--teal)' : 'var(--muted)',
                    border: `1px solid ${profile.track === t ? 'var(--teal)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Persona */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>人设</label>
            <div className="flex flex-wrap gap-2">
              {PERSONAS.map(p => (
                <button
                  key={p}
                  onClick={() => update({ persona: p })}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: profile.persona === p ? 'rgba(45,212,191,0.12)' : 'var(--ocean-deep)',
                    color: profile.persona === p ? 'var(--teal)' : 'var(--muted)',
                    border: `1px solid ${profile.persona === p ? 'var(--teal)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Tone tags */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              文风标签 <span style={{ color: 'var(--muted)', fontWeight: 400 }}>（最多5个）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map(t => {
                const selected = profile.toneTags?.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => {
                      if (selected) {
                        update({ toneTags: profile.toneTags.filter(x => x !== t) });
                      } else if ((profile.toneTags || []).length < 5) {
                        update({ toneTags: [...(profile.toneTags || []), t] });
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: selected ? 'rgba(45,212,191,0.12)' : 'var(--ocean-deep)',
                      color: selected ? 'var(--teal)' : 'var(--muted)',
                      border: `1px solid ${selected ? 'var(--teal)' : 'var(--border-subtle)'}`,
                      opacity: (!selected && (profile.toneTags || []).length >= 5) ? 0.4 : 1,
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Forbidden words */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              避雷词 <span style={{ color: 'var(--muted)', fontWeight: 400 }}>（每行一个，最多20个）</span>
            </label>
            <textarea
              value={profile.forbiddenWords || ''}
              onChange={(e) => update({ forbiddenWords: e.target.value })}
              placeholder="不希望AI使用的词汇，每行一个&#10;例如：&#10;竞品名&#10;敏感词"
              rows={4}
              className="w-full p-3 rounded-lg text-sm resize-none"
              style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
            />
          </div>

          {/* Sample texts */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              范文上传 <span style={{ color: 'var(--muted)', fontWeight: 400 }}>（上传3-5篇你满意的文章，AI学习你的真实文风）</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                placeholder="粘贴一篇你写的文章（至少20字）..."
                className="flex-1 p-2.5 rounded-lg text-sm"
                style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', outline: 'none' }}
              />
              <button
                onClick={addSample}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'var(--teal)', color: '#0A1929' }}
              >
                添加
              </button>
            </div>
            {(profile.sampleTexts || []).length > 0 && (
              <div className="space-y-2">
                {(profile.sampleTexts || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)' }}>
                    <span className="flex-shrink-0 text-xs mt-0.5" style={{ color: 'var(--teal)' }}>#{i + 1}</span>
                    <span className="flex-1" style={{ color: 'var(--muted)' }}>{s.slice(0, 120)}{s.length > 120 ? '...' : ''}</span>
                    <button onClick={() => removeSample(i)} className="text-xs" style={{ color: '#EF4444' }}>删除</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl font-semibold text-base transition-all"
            style={{
              background: saved ? '#10B981' : 'linear-gradient(135deg, var(--teal), #0EA5E9)',
              color: '#fff',
            }}
          >
            {saved ? '保存成功' : '保存品牌设置'}
          </button>

          {/* Data export */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
              数据存储在本地浏览器。换设备或清缓存会丢失，建议定期导出备份。
            </p>
            <button
              onClick={() => {
                const data = {
                  brand: loadProfile(),
                  favorites: JSON.parse(localStorage.getItem('jianjing_lab_favorites') || '[]'),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `jianjing-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'var(--ocean-deep)', border: '1px solid var(--border-subtle)', color: 'var(--muted)' }}
            >
              导出全部数据
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
