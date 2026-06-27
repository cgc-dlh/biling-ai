import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策 - 见鲸',
};

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--ocean-deep)', minHeight: '100vh' }}>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--ink)', lineHeight: 1.8, fontSize: 15 }}>
        <h1 style={{ color: 'var(--teal)', fontSize: '1.8rem', marginBottom: '1rem' }}>隐私政策</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>最后更新：2026年6月27日</p>

        <h2 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>1. 信息收集</h2>
        <p style={{ color: 'var(--muted)' }}>见鲸（以下简称「我们」）在 MVP 内测阶段，所有用户数据（包括品牌设置、收藏的标题、日历计划、邀请码等）均存储在<strong style={{ color: 'var(--ink)' }}>你的本地浏览器 localStorage 中</strong>。我们不会将以上数据上传到任何服务器。</p>

        <h2 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>2. 信息使用</h2>
        <p style={{ color: 'var(--muted)' }}>你输入的内容通过加密传输发送到 AI API（当前为 Agnes AI）进行处理，仅用于生成你请求的标题、SEO 分析或内容优化结果。我们<strong style={{ color: 'var(--ink)' }}>不会存储、不会分享、不会用于 AI 模型训练</strong>。</p>

        <h2 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>3. 数据安全</h2>
        <p style={{ color: 'var(--muted)' }}>由于数据存储在本地浏览器中，清缓存、换设备或使用隐私模式会导致数据丢失。建议定期使用品牌设置页底部的「导出全部数据」功能进行备份。我们会在正式版上线后提供云端存储选项。</p>

        <h2 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>4. 第三方服务</h2>
        <p style={{ color: 'var(--muted)' }}>我们使用以下第三方服务：百度统计（用于网站访问分析）、Agnes AI（用于 AI 内容生成）。这些服务各自的隐私政策请参考其官方网站。</p>

        <h2 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>5. 联系我们</h2>
        <p style={{ color: 'var(--muted)' }}>如有任何隐私相关问题，请通过产品内的反馈渠道联系我们。</p>

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <a href="/" style={{ color: 'var(--teal)', fontSize: '0.85rem', textDecoration: 'none' }}>← 返回首页</a>
        </div>
      </main>
    </div>
  );
}
