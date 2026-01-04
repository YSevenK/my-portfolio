# 🚀 Full-Stack Portfolio CMS

基于 **Next.js 15 (App Router)** 和 **Supabase** 构建的高性能全栈作品集管理系统。

本项目是一个个人作品展示主页

---

## ✨ 技术栈

* **框架**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
* **数据库**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
* **鉴权**: [Supabase Auth](https://supabase.com/auth) (基于 Cookie 的服务端校验)
* **安全**: Next.js Middleware + PostgreSQL **RLS (Row Level Security)**
* **样式**: [Tailwind CSS](https://tailwindcss.com/)
* **部署**: Vercel

---

## 🛠️ 核心功能

### 1. 游客前台 (Public Frontend)
* **响应式展示**: 基于网格布局的项目列表，适配移动端和桌面端。
* **动态路由**: 为每个项目自动生成的详情页面 (`/projects/[id]`)。
* **SEO 优化**: 利用 Server Components 进行服务端渲染，提升搜索引擎索引效率。

### 2. 管理员后台 (Admin Dashboard)
* **路由守卫**: 利用 Middleware 在边缘侧拦截未授权访问。
* **项目管理 (CRUD)**: 动态添加项目，实时刷新首页缓存 (`revalidatePath`)。
* **安全退出**: 集成服务端退出逻辑，彻底清理 Session。

---

## 📦 快速开始

### 1. 环境准备
在根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase_Project_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=你的Supabase_Anon_Key
```