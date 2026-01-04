import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params // 在 Next.js 15 中需要 await params

  // 获取特定 ID 的项目数据
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) return notFound()

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
        ← 返回首页
      </Link>

      <h1 className="text-4xl font-bold mb-6">{project.title}</h1>

      {project.image_url && (
        <img
          src={project.image_url}
          className="w-full rounded-2xl shadow-lg mb-10"
          alt={project.title}
        />
      )}

      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        {/* 这里展示详细描述，如果是 Markdown 格式可以使用 react-markdown */}
        <p className="whitespace-pre-wrap">{project.description}</p>
      </div>
    </div>
  )
}