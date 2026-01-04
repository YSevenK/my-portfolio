'use client'
import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false) // 增加加载状态
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                alert('登录失败: ' + error.message)
                setLoading(false)
                return
            }

            // 关键点：Next.js 14/15 推荐先调用 refresh，再进行 push
            // router.refresh() 会更新当前所有 Server Components 的数据
            router.refresh()

            // 稍微给浏览器一点点时间写入 Cookie (100ms 即可)
            setTimeout(() => {
                // 建议优先使用 router.push，如果还是不行再换回 location.href
                window.location.href = '/admin'
            }, 100)

        } catch (err) {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleLogin} className="p-8 bg-white border rounded-xl shadow-md w-80 space-y-4">
                <h1 className="text-xl font-bold text-center">管理员登录</h1>
                <input
                    type="email"
                    placeholder="邮箱"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="密码"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded text-white transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                        }`}
                >
                    {loading ? '验证中...' : '进入后台'}
                </button>
            </form>
        </div>
    )
}