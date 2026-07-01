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
  { icon: '\u2728', title: 'AI Title Generator', desc: 'Generate 100+ click-worthy titles in seconds. Multi-platform optimized for WeChat, XHS, Zhihu, Medium, and more.' },
  { icon: '\uD83D\uDCCA', title: 'SEO Analyzer', desc: 'Real-time SEO scoring with actionable suggestions. Keyword density, readability, and CTR prediction.' },
  { icon: '\uD83D\uDE80', title: 'Content Optimizer', desc: 'Rewrite and polish your drafts with AI. Tone adjustment, style matching, and brand voice consistency.' },
  { icon: '\uD83D\uDD2C', title: 'Viral Lab', desc: 'Study trending titles across platforms. Save favorites and build your personal swipe file.' },
  { icon: '\uD83D\uDCC5', title: 'Content Calendar', desc: 'Plan your publishing schedule with AI-powered timing recommendations. Track completion rates.' },
  { icon: '\uD83D\uDD0C', title: 'Browser Extension', desc: 'One-click title generation and analysis on any webpage. Works on Chrome, Edge, and Firefox.' },
];

const STEPS = [
  { num: '01', title: 'Paste Content', desc: 'Drop in your draft, article, or raw ideas. Any length, any format.' },
  { num: '02', title: 'AI Optimize', desc: 'Our AI analyzes tone, SEO, and platform fit to suggest improvements in real time.' },
  { num: '03', title: 'Publish Everywhere', desc: 'Export optimized copy for WeChat, XHS, Medium, LinkedIn, and 15+ platforms instantly.' },
];

const DEMO_CARDS = [
  { title: 'Title Generator', lines: ['10 Viral Headlines for Your Next Post', '1. The Ultimate Guide to...', '2. 7 Mistakes Everyone Makes...', '3. How I Grew to 100K in...', 'Generate more', 'Platform: WeChat | Score: 92'] },
  { title: 'SEO Analysis', lines: ['Keyword Density: 2.4%', 'Readability: Grade 8 (Good)', 'Meta Title: 58 chars', 'Meta Description: 152 chars', 'Suggested: Add H2 tags', 'Overall Score: 87/100'] },
  { title: 'Content Optimizer', lines: ['Original: "Our product helps..."', 'Optimized: "Cut your workload', 'by 70% with AI-powered', 'content automation..."', 'Tone: Professional -> Casual', 'Confidence: 94%'] },
];

const TESTIMONIALS = [
  { initial: 'S', name: 'Sarah Chen', role: 'Content Lead @ TechFlow', text: 'JianJing cut our title brainstorm time from 2 hours to 5 minutes. The multi-platform optimization is a game changer.' },
  { initial: 'M', name: 'Marcus Liu', role: 'Indie Creator', text: 'Finally an AI tool that understands Chinese social media. My XHS engagement doubled after using the viral title suggestions.' },
  { initial: 'A', name: 'Anna Wang', role: 'Marketing Manager', text: 'The SEO analyzer caught issues our team missed for months. Worth every penny of the Pro plan.' },
];

const PLANS = [
  { name: 'Free', price: '$0', period: '/mo', desc: 'Perfect for trying out', features: ['50 titles/mo', 'Basic SEO scan', '3 platforms', 'Community support'], highlight: false },
  { name: 'Pro', price: '$12', period: '/mo', desc: 'For serious creators', features: ['Unlimited titles', 'Full SEO suite', '15+ platforms', 'Priority support', 'Browser extension'], highlight: true },
  { name: 'Team', price: '$39', period: '/mo', desc: 'For content teams', features: ['Everything in Pro', 'Team workspace', 'Brand voice presets', 'Analytics dashboard', 'API access'], highlight: false },
];

const FAQS = [
  { q: 'What platforms does JianJing support?', a: 'We support WeChat, XiaoHongShu (XHS), Zhihu, Medium, LinkedIn, Twitter/X, TikTok, and 15+ more platforms with tailored optimization for each.' },
  { q: 'Is there a free plan?', a: 'Yes. The Free plan includes 50 title generations per month and basic SEO scanning. No credit card required to sign up.' },
  { q: 'How is this different from ChatGPT?', a: 'JianJing is built specifically for content creators. We understand platform-specific algorithms, Chinese social media trends, and provide real-time SEO scoring.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Absolutely. You can cancel, upgrade, or downgrade your plan at any time from your account settings. No hidden fees.' },
];

export default function ProductHuntPage() {
  const [countdown, setCountdown] = useState(getCountdown());
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const socialLink = (href: string, label: string, d: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition-all hover:opacity-80" style={{ color: 'rgba(148,163,184,0.6)' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
    </a>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0A1929 0%, #0F172A 100%)' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-50" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,25,41,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="14" stroke="#2DD4BF" strokeWidth="2" fill="none" />
              <path d="M10 20 C8 22, 6 18, 12 14 C14 12, 10 11, 15 6 C9 11, 10 11, 12 14 C8 18, 6 22, 10 20Z" fill="#2DD4BF" fillOpacity="0.6" />
              <circle cx="15" cy="10" r="1.5" fill="#F59E0B" />
            </svg>
            <span className="font-bold text-lg" style={{ color: '#2DD4BF' }}>JianJing</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <a href="https://www.producthunt.com/products/jianjing" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg font-medium text-xs transition-all" style={{ background: '#DA552F', color: '#fff' }}>
              Upvote on Product Hunt
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6" style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', color: '#2DD4BF' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
            </span>
            Launching on Product Hunt July 15, 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: '#F8FAFC' }}>
            JianJing &mdash; AI Content Editor
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'rgba(148,163,184,0.9)' }}>
            The AI-powered content editor that gets smarter with every use. Generate titles, optimize copy, analyze SEO, and plan your publishing schedule &mdash; all in one place.
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email for early access" required className="flex-1 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', outline: 'none' }} />
            <button type="submit" className="px-6 py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: 'linear-gradient(135deg, #2DD4BF, #0EA5E9)', color: '#0A1929' }}>
              {subscribed ? 'Subscribed!' : 'Get Notified'}
            </button>
          </form>
          {subscribed && <p className="mt-2 text-xs" style={{ color: '#2DD4BF' }}>Thanks! We will notify you when we go live.</p>}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#F8FAFC' }}>How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="p-6 rounded-xl text-center" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-3xl font-bold mb-3" style={{ color: '#2DD4BF' }}>{s.num}</div>
                <h3 className="font-semibold mb-2" style={{ color: '#F8FAFC' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#F8FAFC' }}>See It In Action</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DEMO_CARDS.map((card) => (
              <div key={card.title} className="rounded-xl overflow-hidden" style={{ background: '#0B1220', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(15,23,42,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22C55E' }} />
                  </div>
                  <span className="text-xs font-medium ml-1" style={{ color: 'rgba(148,163,184,0.7)' }}>{card.title}</span>
                </div>
                <div className="p-4 space-y-2">
                  {card.lines.map((line, i) => (
                    <div key={i} className="h-2 rounded" style={{ width: `${60 + (i % 3) * 15}%`, background: i === card.lines.length - 1 ? 'rgba(45,212,191,0.2)' : 'rgba(148,163,184,0.15)' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
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

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#F8FAFC' }}>Loved by Creators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-5 rounded-xl" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>{t.initial}</div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>{t.role}</div>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'rgba(148,163,184,0.85)' }}>&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#F8FAFC' }}>Simple Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div key={plan.name} className="relative p-6 rounded-xl" style={{ background: plan.highlight ? 'rgba(45,212,191,0.05)' : 'rgba(15,23,42,0.6)', border: plan.highlight ? '1px solid rgba(45,212,191,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: '#2DD4BF', color: '#0A1929' }}>Recommended</div>}
                <div className="text-sm font-medium mb-1" style={{ color: 'rgba(148,163,184,0.7)' }}>{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold" style={{ color: '#F8FAFC' }}>{plan.price}</span>
                  <span className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>{plan.period}</span>
                </div>
                <div className="text-xs mb-4" style={{ color: 'rgba(148,163,184,0.6)' }}>{plan.desc}</div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(148,163,184,0.85)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-lg text-sm font-semibold transition-all" style={{ background: plan.highlight ? 'linear-gradient(135deg, #2DD4BF, #0EA5E9)' : 'rgba(255,255,255,0.06)', color: plan.highlight ? '#0A1929' : '#F8FAFC' }}>
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#F8FAFC' }}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="2" className="transition-transform" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-10 text-center mb-16" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#F8FAFC' }}>Ready to Write Smarter?</h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'rgba(148,163,184,0.8)' }}>Join thousands of creators who are already using JianJing to publish better content, faster.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all no-underline" style={{ background: 'linear-gradient(135deg, #2DD4BF, #0EA5E9)', color: '#0A1929' }}>
            Try It Free
          </Link>
        </div>

        {/* PH CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F8FAFC' }}>Support Us on Product Hunt</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'rgba(148,163,184,0.8)' }}>
            We are launching July 15th. Your upvote and feedback would mean the world to us. Join the waitlist and be the first to know.
          </p>
          <a href="https://www.producthunt.com/products/jianjing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all" style={{ background: '#DA552F', color: '#fff' }}>
            Follow on Product Hunt
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>
            &copy; 2026 JianJing. Built for content creators worldwide.
          </p>
          <div className="flex items-center gap-4">
            {socialLink('https://twitter.com/jianjing', 'Twitter', 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z')}
            {socialLink('https://linkedin.com/company/jianjing', 'LinkedIn', 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z')}
            {socialLink('https://github.com/jianjing', 'GitHub', 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12')}
          </div>
        </div>
      </footer>
    </div>
  );
}
