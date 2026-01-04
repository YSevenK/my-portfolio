import { createBrowserClient } from '@supabase/ssr'

// 1. 提取变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // 建议统一使用这个标准名称

// 2. 增加容错判断：如果变量不存在，不直接崩溃，而是返回一个占位符或 null
export const supabase = createBrowserClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)