import { createClient } from '@/utils/supabase/server'
import { addProject, signOut } from '@/server/actions/actions'
import { LogOut, PlusCircle, LayoutDashboard, Database, Activity, Globe } from 'lucide-react'
import { redirect } from 'next/navigation'
import ProjectItem from './_components/ProjectItem'

export default async function AdminPage() {
  const supabase = await createClient()

  // 1. 获取用户信息
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. 获取项目数据并检测连接
  const { data: projects, error: dbError } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false })

  // 3. 状态判断
  const isDbConnected = !dbError
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-black pb-20 font-sans selection:bg-black selection:text-white">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">控制台</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-400 border border-gray-200 px-2 py-1 rounded-md hidden sm:block">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="p-2 hover:bg-red-50 rounded-full transition-all text-gray-400 hover:text-red-500 group"
                title="退出登录"
              >
                <LogOut className="w-5 h-5 group-active:scale-90 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* 总项目数 */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-32 hover:border-black transition-colors duration-300">
            <div className="flex items-center gap-2 text-gray-400">
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">总项目数</span>
            </div>
            <p className="text-4xl font-black tracking-tight leading-none italic">
              {projects?.length || 0}
            </p>
          </div>

          {/* 数据库连接状态 */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-32 hover:border-black transition-colors duration-300">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">数据库连接</span>
            </div>
            <div className="flex">
              {isDbConnected ? (
                <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100 uppercase tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  PostgreSQL 正常
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100 uppercase tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  连接异常
                </div>
              )}
            </div>
          </div>

          {/* 运行环境 */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-32 hover:border-black transition-colors duration-300">
            <div className="flex items-center gap-2 text-gray-400">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">运行环境</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {isDev ? (
                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-black border border-amber-200">LOCAL</span>
                ) : (
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-black border border-blue-200">PROD</span>
                )}
                <span className="text-xs font-mono text-gray-400 truncate">
                  {isDev ? 'localhost:3000' : 'vercel.app'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 关键优化点：使用 items-start 确保左右两栏从顶端对齐 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* 左侧：发布表单 */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-8 flex items-center gap-2 text-gray-900">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                新增项目
              </h2>

              <form action={addProject} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">标题</label>
                  <input
                    name="title"
                    required
                    placeholder="输入项目名称"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black focus:bg-white transition-all placeholder:text-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">描述</label>
                  <textarea
                    name="description"
                    rows={4}
                    required
                    placeholder="简述核心功能与技术栈"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black focus:bg-white transition-all resize-none text-sm leading-relaxed placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">封面图 URL</label>
                  <input
                    name="image_url"
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black focus:bg-white transition-all text-sm placeholder:text-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98] mt-4"
                >
                  发布新作品
                </button>
              </form>
            </div>
          </div>

          {/* 右侧：列表展示 */}
          <div className="lg:col-span-7">
            {/* 这里的标题栏高度和左侧的标题高度做了视觉对齐优化 */}
            <div className="flex items-center gap-4 mb-8">
               <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">
                项目列表
              </h2>
              <div className="flex-grow h-px bg-gray-200/60"></div>
            </div>

            <div className="space-y-4">
              {projects?.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}

              {projects?.length === 0 && (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-300">
                  <p className="text-xs font-bold uppercase tracking-widest">Empty Workspace</p>
                  <p className="text-[10px] mt-2">暂无数据，请从左侧添加</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}