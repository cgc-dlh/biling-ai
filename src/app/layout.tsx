import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '笔灵AI - 让每篇内容都有10万+的潜力',
  description: 'AI内容优化助手，一键生成爆款标题、智能SEO优化、多平台适配。',
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