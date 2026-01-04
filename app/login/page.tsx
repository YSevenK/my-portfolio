'use client'
import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    router.refresh()
    setTimeout(() => window.location.href = '/admin', 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">欢迎回来</h1>
          <p className="text-sm text-gray-500 mt-2">请输入管理员账号访问后台</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-black placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">登录密码</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-black placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                验证中...
              </span>
            ) : "立即登录"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Secure Admin Panel</p>
        </div>
      </div>
    </div>
  )
}