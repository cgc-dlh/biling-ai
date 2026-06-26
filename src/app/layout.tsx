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
  verification: {
    // 百度统计验证码 - 替换为你的实际验证码
    // baidu: 'your-baidu-verify-code',
    // google: 'your-google-verify-code',
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
        {/* 百度统计 - 替换 BA_ID 为你的实际统计 ID */}
        {/* <script defer src="https://hm.baidu.com/hm.js?BA_ID_HERE"></script> */}

        {/* Google Analytics - 替换 GA_ID 为你的实际测量 ID (G-XXXXXXX) */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID_HERE"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_ID_HERE');
            `,
          }}
        /> */}

        {/* 百度站长推送 - 替换 TOKEN 为你的实际 token */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var bp = document.createElement('script');
                var curProtocol = window.location.protocol.split(':')[0];
                if (curProtocol === 'https') {
                  bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
                } else {
                  bp.src = 'http://push.zhanzhang.baidu.com/push.js';
                }
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(bp, s);
              })();
            `,
          }}
        /> */}
      </head>
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
