'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProject(formData: FormData) {
  // 1. 获取数据
  const title = formData.get('title')
  const description = formData.get('description')
  const image_url = formData.get('image_url')

  // 2. 初始化带权限的客户端
  const supabase = await createClient()

  // 3. 执行插入
  try {
    const { error } = await supabase
      .from('projects')
      .insert([{ title, description, image_url }])

    if (error) {
      // console.error('RLS 拒绝详情:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
  } catch (error) {
    // console.error('RLS 拒绝详情:', error);
    throw new Error('项目获取失败');
  }
}
