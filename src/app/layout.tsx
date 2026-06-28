import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '见鲸 JianJing — AI Content Editor · Learns Your Voice',
  description: 'JianJing is your AI content editor. Paste one post, get 17 platform versions (WeChat, Instagram, LinkedIn, TikTok, Reddit, and more). Set your brand voice once — the AI remembers and gets better.',
  keywords: ['JianJing', 'AI content editor', 'multi-platform content', 'AI writing', 'headline generator', '见鲸', 'AI标题生成', '内容优化', '自媒体工具'],
  authors: [{ name: 'JianJing / 见鲸' }],
  robots: 'index, follow',
  openGraph: {
    title: '见鲸 JianJing — AI Content Editor · Learns Your Voice',
    description: 'One post → 17 platforms. AI auto-adapts style. Free beta.',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JianJing — AI Content Editor',
    description: 'One post → 17 platforms. AI learns your voice over time.',
  },
  alternates: {
    canonical: 'https://golden-gingersnap-790cb7.netlify.app',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 百度统计 */}
        <script defer src="https://hm.baidu.com/hm.js?590aa4ea568b68f10824732190d2c4e1"></script>
      </head>
      <body className="antialiased min-h-screen" style={{ background: 'var(--ocean-deep)', color: 'var(--ink)' }}>
        {children}
      </body>
    </html>
  );
}
