import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '见鲸 - AI智能内容编辑 · 越用越懂你',
  description: '见鲸是你的专属AI内容编辑。设置一次品牌风格，AI自动记住。提供AI标题生成、SEO分析、多平台一键适配（公众号/小红书/知乎/头条/百家号/抖音/B站/微博/快手），越用越懂你的文风。',
  keywords: ['见鲸', 'AI标题生成', '内容优化', 'SEO分析', '自媒体工具', 'AI写作', '爆款标题', '多平台适配', '品牌分身'],
  authors: [{ name: '见鲸' }],
  robots: 'index, follow',
  openGraph: {
    title: '见鲸 - AI智能内容编辑 · 越用越懂你',
    description: '你的专属AI内容编辑。设置一次品牌风格，AI自动记住，越用越像你自己在写。',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '见鲸 - AI智能内容编辑',
    description: '你的专属AI内容编辑。越用越懂你。',
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
