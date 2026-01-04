'use client'

import { useState } from 'react'
import { Trash2, Edit3, Check, X, Loader2 } from 'lucide-react'
import { deleteProject, updateProject } from '@/server/actions/actions'

export default function ProjectItem({ project }: { project: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // 处理删除逻辑
  async function handleDelete() {
    if (!confirm('确定要永久删除这个项目吗？')) return
    setLoading(true)
    try {
      await deleteProject(project.id)
    } catch (err) {
      alert('删除失败')
    } finally {
      setLoading(false)
    }
  }

  // 渲染编辑模式
  if (isEditing) {
    return (
      <form
        action={async (formData) => {
          setLoading(true)
          await updateProject(formData)
          setIsEditing(false)
          setLoading(false)
        }}
        className="bg-white border-2 border-black p-5 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200 space-y-3"
      >
        <input type="hidden" name="id" value={project.id} />
        <input
          name="title"
          defaultValue={project.title}
          autoFocus
          className="w-full font-bold text-lg outline-none border-b border-gray-100 focus:border-black py-1"
        />
        <textarea
          name="description"
          defaultValue={project.description}
          rows={3}
          className="w-full text-sm text-gray-600 outline-none border-b border-gray-100 focus:border-black py-1 resize-none"
        />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-all font-bold text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            保存修改
          </button>
        </div>
      </form>
    )
  }

  // 渲染预览模式
  return (
    <div className="group bg-white border border-gray-200 p-5 rounded-2xl flex items-center gap-4 hover:border-black hover:shadow-md transition-all duration-300">
      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
        {project.image_url ? (
          <img src={project.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase">No Img</div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-gray-900 truncate">{project.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">{project.description}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
          title="编辑项目"
        >
          <Edit3 className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="删除项目"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}