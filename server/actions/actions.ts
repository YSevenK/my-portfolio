'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * 管理员功能函数
 * @param formData
 */

// --- 新增项目 ---
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

// --- 删除项目 ---
export async function deleteProject(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin')
}

// --- 更新项目 ---
export async function updateProject(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id')
  const title = formData.get('title')
  const description = formData.get('description')
  const image_url = formData.get('image_url')

  const { error } = await supabase
    .from('projects')
    .update({ title, description, image_url })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin')
}

// --- 退出登录 ---
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // 退出后重定向到登录页
  redirect('/login')
}