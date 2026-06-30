'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PH_LAUNCH_DATE = '2026-07-15T00:00:00Z';

function getCountdown() {
  const diff = new Date(PH_LAUNCH_DATE).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const FEATURES = [
  {
    icon: '✨',
    title: 'AI Title Generator',
    desc: 'Generate 100+ click-worthy titles in seconds. Multi-platform optimized for WeChat, XHS, Zhihu, Medium, and more.',
  },
  {
    icon: '📊',
    title: 'SEO Analyzer',
    desc: 'Real-time SEO scoring with actionable suggestions. Keyword density, readability, and CTR prediction.',
  },
  {
    icon: '🚀',
    title: 'Content Optimizer',
    desc: 'Rewrite and polish your drafts with AI. Tone adjustment, style matching, and brand voice consistency.',
  },
  {
    icon: '🔬',
    title: 'Viral Lab',
    desc: 'Study trending titles across platforms. Save favorites and build your personal swipe file.',
  },
  {
    icon: '📅',
    title: 'Content Calendar',
    desc: 'Plan your publishing schedule with AI-powered timing recommendations. Track completion rates.',
  },
  {
    icon: '🔌',
    title: 'Browser Extension',
    desc: 'One-click title generation and analysis on any webpage. Works on Chrome, Edge, and Firefox.',
  },
];

export default function ProductHuntPage() {
  const [countdown, setCountdown] = useState(getCountdown());
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const list = JSON.parse(localStorage.getItem('jianjing_ph_waitlist') || '[]');
    if (!list.includes(email.trim())) {
      list.push(email.trim());
      localStorage.setItem('jianjing_ph_waitlist', JSON.stringify(list));
    }
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0A1929 0%, #0F172A 100%)' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-50" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,25,41,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="14" stroke="#2DD4BF" strokeWidth="2" fill="none"/>
              <path d="M10 20 C8 22, 6 18, 12 14 C14 12, 10 11, 15 6 C9 11, 10 11, 12 14 C8 18, 6 22, 10 20Z" fill="#2DD4BF" fillOpacity="0.6"/>
              <circle cx="15" cy="10" r="1.5" fill="#F59E0B"/>
            </svg>
            <span className="font-bold text-lg" style={{ color: '#2DD4BF' }}>JianJing</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <a href="https://www.producthunt.com/products/jianjing" target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg font-medium text-xs transition-all"
              style={{ background: '#DA552F', color: '#fff' }}>
              🔼 Product Hunt
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6" style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', color: '#2DD4BF' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
            </span>
            Launching on Product Hunt July 15, 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: '#F8FAFC' }}>
            JianJing — AI Content Editor
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'rgba(148,163,184,0.9)' }}>
            The AI-powered content editor that gets smarter with every use. Generate titles, optimize copy, analyze SEO, and plan your publishing schedule — all in one place.
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-3 mb-8">
            {[
              { value: countdown.days, label: 'Days' },
              { value: countdown.hours, label: 'Hours' },
              { value: countdown.minutes, label: 'Mins' },
              { value: countdown.seconds, label: 'Secs' },
            ].map((item) => (
              <div key={item.label} className="w-16 sm:w-20 p-3 rounded-xl text-center" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-xl sm:text-2xl font-bold" style={{ color: '#2DD4BF' }}>{String(item.value).padStart(2, '0')}</div>
                <div className="text-[10px] mt-1" style={{ color: 'rgba(148,163,184,0.6)' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              required
              className="flex-1 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', outline: 'none' }}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, #2DD4BF, #0EA5E9)', color: '#0A1929' }}
            >
              {subscribed ? '✓ Subscribed!' : 'Get Notified'}
            </button>
          </form>
          {subscribed && (
            <p className="mt-2 text-xs" style={{ color: '#2DD4BF' }}>Thanks! We will notify you when we go live.</p>
          )}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#F8FAFC' }}>Everything You Need to Create Better Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-5 rounded-xl" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-1" style={{ color: '#F8FAFC' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why JianJing */}
        <div className="rounded-2xl p-8 mb-16" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#F8FAFC' }}>Why Creators Love JianJing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { num: '10x', label: 'Faster Title Generation', desc: 'Generate 100+ optimized titles in under 30 seconds' },
              { num: '15+', label: 'Platforms Supported', desc: 'From WeChat to Medium, TikTok to LinkedIn' },
              { num: '0', label: 'Cost to Start', desc: 'Free tier with generous limits. No credit card required.' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold mb-1" style={{ color: '#2DD4BF' }}>{s.num}</div>
                <div className="font-medium mb-1" style={{ color: '#F8FAFC' }}>{s.label}</div>
                <div className="text-xs" style={{ color: 'rgba(148,163,184,0.7)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PH CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F8FAFC' }}>Support Us on Product Hunt</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'rgba(148,163,184,0.8)' }}>
            We are launching July 15th. Your upvote and feedback would mean the world to us. Join the waitlist and be the first to know.
          </p>
          <a
            href="https://www.producthunt.com/products/jianjing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
            style={{ background: '#DA552F', color: '#fff' }}
          >
            <span>🔼</span> Follow on Product Hunt
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-16" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>
            © 2026 JianJing (见鲸) · Built for content creators worldwide
          </p>
        </div>
      </footer>
    </div>
  );
}
