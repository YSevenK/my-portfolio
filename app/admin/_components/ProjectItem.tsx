'use client'

import { useState } from 'react'
import { Trash2, Edit3, Check, X, Loader2, AlertCircle } from 'lucide-react'
import { deleteProject, updateProject } from '@/server/actions/actions'
import { toast } from 'react-hot-toast'

interface ProjectItemProps {
  project: any
  onDeleteSuccess: (id: number) => void
  onUpdateSuccess: (project: any) => void
}

export default function ProjectItem({ project, onDeleteSuccess, onUpdateSuccess }: ProjectItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // 1. 自定义删除确认吐司
  const confirmDelete = () => {
    toast((t) => (
      <div className="flex items-center gap-4 py-2 min-w-70">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <div className="grow">
          <p className="text-sm font-bold text-gray-900">确定要删除吗？</p>
          <p className="text-xs text-gray-500 mt-1">此操作无法撤销</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { toast.dismiss(t.id); handleDelete(); }}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
          >
            删除
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' })
  }

  async function handleDelete() {
    const loadingToast = toast.loading('正在从数据库移除...')
    setLoading(true)
    try {
      await deleteProject(project.id)
      onDeleteSuccess(project.id)
      toast.success('项目已移除', { id: loadingToast })
    } catch (err) {
      toast.error('移除失败', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(formData: FormData) {
    const loadingToast = toast.loading('正在同步修改...')
    setLoading(true)
    try {
      await updateProject(formData)
      const updatedData = {
        ...project,
        title: formData.get('title'),
        description: formData.get('description'),
        image_url: formData.get('image_url')
      }
      onUpdateSuccess(updatedData)
      setIsEditing(false)
      toast.success('修改内容已保存', { id: loadingToast })
    } catch (err) {
      toast.error('保存失败', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <form action={handleUpdate} className="bg-white border-2 border-black p-8 rounded-3xl shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
        <input type="hidden" name="id" value={project.id} />
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">项目标题</label>
            <input name="title" defaultValue={project.title} className="w-full font-bold text-xl outline-none border-b-2 border-gray-100 focus:border-black py-2 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">详细描述</label>
            <textarea name="description" defaultValue={project.description} rows={4} className="w-full text-base text-gray-600 outline-none border-b-2 border-gray-100 focus:border-black py-2 resize-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">图片 URL</label>
            <input name="image_url" defaultValue={project.image_url} className="w-full text-sm font-mono text-blue-500 outline-none border-b-2 border-gray-100 focus:border-black py-2" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">取消</button>
          <button type="submit" className="bg-black text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
            <Check className="w-5 h-5" /> 保存修改内容
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="group bg-white border border-gray-200 p-6 rounded-3xl flex items-center gap-6 hover:border-black hover:shadow-xl transition-all duration-500">
      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
        {project.image_url ? (
          <img src={project.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-black">NO IMAGE</div>
        )}
      </div>

      <div className="grow min-w-0">
        <h3 className="font-bold text-lg text-gray-900 truncate tracking-tight">{project.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-1 mt-1 font-medium">{project.description}</p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <button onClick={() => setIsEditing(true)} className="p-3 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all">
          <Edit3 className="w-5 h-5" />
        </button>
        <button onClick={confirmDelete} disabled={loading} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}