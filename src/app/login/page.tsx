'use client';

import { useState, useEffect } from 'react';
import { signUp, signIn, getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 如果已登录，跳转到首页
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const result = signUp(email, password);
        if (!result.success) {
          setError(result.error || '注册失败');
        } else {
          setMessage('注册成功！已自动登录。');
          setTimeout(() => router.push('/'), 1000);
        }
      } else {
        const result = signIn(email, password);
        if (!result.success) {
          setError(result.error || '登录失败');
        } else {
          router.push('/');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '操作失败';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white text-lg font-bold">✏</div>
            <span className="font-bold text-2xl text-blue-600">笔灵AI</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            {isSignUp ? '创建账号' : '登录'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6位"
                required
                minLength={6}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
            {message && <p className="text-sm text-green-500 bg-green-50 px-4 py-2 rounded-lg">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? '处理中...' : isSignUp ? '注册' : '登录'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            {isSignUp ? '已有账号？' : '没有账号？'}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
              className="text-blue-600 font-medium ml-1 hover:underline"
            >
              {isSignUp ? '去登录' : '去注册'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
