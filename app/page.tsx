import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  // 1. 从数据库获取所有项目
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    return (
      <div className="p-20 text-center text-red-500">
        数据加载失败，请检查数据库连接
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 min-h-screen">
      {/* 头部标题区 */}
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-4">
          作品集展示
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-500">
          探索我最近开发的全栈项目。每一个项目都代表了我对技术的探索与实践。
        </p>
      </header>

      {/* 项目展示网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.map((project) => (
          /* 使用 Link 包裹整个卡片，实现动态路由跳转 */
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="group block"
          >
            <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

              {/* 图片区域 */}
              <div className="aspect-video bg-gray-50 relative overflow-hidden border-b border-gray-50">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50 font-medium">
                    无项目封面
                  </div>
                )}
                {/* 悬浮提示文本 */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                     查看详情 →
                   </span>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-6 grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                  {project.description || "暂无详细描述..."}
                </p>

                {/* 底部技术标签（装饰用，体现专业性） */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold rounded-md border border-slate-100">
                    Next.js
                  </span>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold rounded-md border border-slate-100">
                    Supabase
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-500 text-[10px] uppercase tracking-wider font-bold rounded-md border border-blue-100">
                    Tailwind
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 空状态提示 */}
      {projects?.length === 0 && (
        <div className="text-center py-32">
          <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
             <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
             </svg>
          </div>
          <p className="text-gray-400">目前还没有任何项目作品</p>
          <Link href="/admin" className="text-blue-500 text-sm mt-2 hover:underline inline-block">
            前往后台添加项目
          </Link>
        </div>
      )}
    </main>
  )
}