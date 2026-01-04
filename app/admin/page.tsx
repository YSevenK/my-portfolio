'use client'

import { useEffect, useState } from 'react'
import { addProject, signOut } from '@/server/actions/actions'
import { LogOut, PlusCircle, LayoutDashboard, Database, Activity, Globe, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ProjectItem from './_components/ProjectItem'
import { supabase } from '@/utils/supabase'

export default function AdminPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false })
    if (error) setDbError(true)
    else setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleSubmit(formData: FormData) {
    const loadingToast = toast.loading('正在发布新项目...')
    try {
      await addProject(formData)
      await fetchData()
      toast.success('项目发布成功！', { id: loadingToast })
      const form = document.getElementById('project-form') as HTMLFormElement
      form?.reset()
    } catch (error) {
      toast.error('发布失败', { id: loadingToast })
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
      <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
    </div>
  )

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 pb-20 selection:bg-black selection:text-white">
      {/* 导航栏 - 增加高度 */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 h-20 flex items-center shadow-sm">
        <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">管理控制台</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-500 hidden md:block">{user?.email}</span>
            <form action={signOut}>
              <button type="submit" className="p-2.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-all group">
                <LogOut className="w-6 h-6 group-active:scale-90" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* 统计卡片 - 增加字号 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border border-gray-200 p-8 rounded-2xl h-40 flex flex-col justify-between shadow-sm hover:border-black transition-colors">
            <div className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 tracking-widest"><Database className="w-4 h-4"/> 项目总数</div>
            <p className="text-5xl font-black italic tracking-tighter">{projects.length}</p>
          </div>
          <div className="bg-white border border-gray-200 p-8 rounded-2xl h-40 flex flex-col justify-between shadow-sm hover:border-black transition-colors">
            <div className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 tracking-widest"><Activity className="w-4 h-4"/> 数据库状态</div>
            <div className={`text-lg font-bold flex items-center gap-2 ${!dbError ? 'text-green-600' : 'text-red-500'}`}>
               <span className={`w-3 h-3 rounded-full ${!dbError ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
               {!dbError ? '已连接' : '连接异常'}
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-8 rounded-2xl h-40 flex flex-col justify-between shadow-sm hover:border-black transition-colors">
            <div className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 tracking-widest"><Globe className="w-4 h-4"/> 环境标识</div>
            <span className={`text-sm font-bold px-3 py-1 rounded-lg w-fit border ${isDev ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
              {isDev ? '本地开发环境' : '正式生产环境'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 左侧：表单 - 增加输入框尺寸 */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-sm">
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
                <PlusCircle className="w-7 h-7 text-blue-600" /> 新增项目
              </h2>
              <form id="project-form" action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">项目标题</label>
                  <input name="title" required placeholder="例如：全栈作品集" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-base" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">项目描述</label>
                  <textarea name="description" rows={5} required placeholder="简述技术栈和功能..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-base resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">封面图 URL</label>
                  <input name="image_url" placeholder="https://..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-base" />
                </div>
                <button type="submit" className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98] text-lg shadow-xl shadow-black/10">
                  确认发布项目
                </button>
              </form>
            </div>
          </div>

          {/* 右侧：列表 */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em] whitespace-nowrap">项目管理清单</h2>
              <div className="grow h-px bg-gray-200"></div>
            </div>
            <div className="space-y-5">
              {projects.map((p) => (
                <ProjectItem
                  key={p.id}
                  project={p}
                  onDeleteSuccess={(id) => setProjects(prev => prev.filter(i => i.id !== id))}
                  onUpdateSuccess={(updatedProject) => {
                    setProjects(prev => prev.map(i => i.id === updatedProject.id ? updatedProject : i))
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}