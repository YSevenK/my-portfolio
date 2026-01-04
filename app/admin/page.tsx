// app/admin/page.tsx
import { addProject } from '../../server/actions/actions'

export default function AdminPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">发布新项目</h1>

      <form action={addProject} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">项目名称</label>
          <input name="title" type="text" required className="w-full border p-2 rounded text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium">项目描述</label>
          <textarea name="description" required className="w-full border p-2 rounded text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium">图片 URL (可先填网络图片地址)</label>
          <input name="image_url" type="text" className="w-full border p-2 rounded text-black" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          确认上传
        </button>
      </form>
    </div>
  )
}