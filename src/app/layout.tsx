import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '笔灵AI - AI标题生成与内容优化工具',
  description: '笔灵AI是一款AI内容优化助手，提供AI标题生成、SEO智能分析、多平台内容适配、AI审校等功能，帮助自媒体人和内容创作者提升内容质量。',
  keywords: ['AI标题生成', '内容优化', 'SEO分析', '自媒体工具', 'AI写作', '爆款标题', '笔灵AI'],
  authors: [{ name: '笔灵AI' }],
  robots: 'index, follow',
  openGraph: {
    title: '笔灵AI - AI标题生成与内容优化工具',
    description: 'AI一键生成爆款标题，智能SEO优化，多平台内容适配',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '笔灵AI - AI标题生成与内容优化工具',
    description: 'AI一键生成爆款标题，智能SEO优化，多平台内容适配',
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
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}