import Link from 'next/link';

/**
 * 共享 Footer 组件
 */
export default function Footer() {
  return (
    <footer className="mt-16 py-6 text-center text-xs border-t" style={{ color: 'var(--muted)', borderColor: 'var(--border-subtle)' }}>
      © 2026 见鲸 · 你的专属AI内容编辑 · MVP内测版
      <span style={{ margin: '0 0.5rem', color: 'var(--border-subtle)' }}>|</span>
      <Link href="/privacy" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>隐私政策</Link>
    </footer>
  );
}
