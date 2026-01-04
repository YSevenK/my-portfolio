import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. 初始化响应对象
    // 我们先创建一个基础响应，后续如果需要设置 Cookie 会更新它
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. 初始化 Supabase 客户端
    // 注意：变量名必须与你的 .env.local 严格一致
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // 这是同步 Cookie 的核心逻辑
                    // 首先在请求中设置，确保后续逻辑（如 getUser）能读到新 Session
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    // 更新响应对象，确保将 Cookie 写回浏览器
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 3. 这里的 getUser() 非常关键，它会自动处理 Token 刷新
    const { data: { user } } = await supabase.auth.getUser()
    // console.log('中间件检查路径:', request.nextUrl.pathname, '用户是否存在:', !!user);
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        // 未登录用户尝试进入后台 -> 重定向到登录页
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/login') && user) {
        // 已登录用户尝试进入登录页 -> 直接送回后台
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
}

export const config = {
    // 匹配器：拦截所有路径，但排除静态资源文件
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}