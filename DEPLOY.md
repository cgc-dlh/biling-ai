# 笔灵AI 部署指南

## 方式一：GitHub + Vercel（推荐）

### 1. 在 GitHub 创建仓库
1. 打开 [github.com](https://github.com)
2. 点击右上角 **+** → **New repository**
3. 仓库名填 `biling-ai`
4. 选择 **Public**（免费）
5. 点击 **Create repository**
6. 复制仓库地址，格式类似：`https://github.com/你的用户名/biling-ai.git`

### 2. 初始化本地 Git 并推送

在 PowerShell 中运行以下命令（替换 `你的用户名`）：

```powershell
# 进入项目目录
cd 'C:\Users\蔡国才\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a39fc34a2e01f99ebb47f13\biling-ai'

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "init: 笔灵AI MVP"

# 关联远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/biling-ai.git

# 推送
git branch -M main
git push -u origin main
```

### 3. 在 Vercel 部署
1. 打开 [vercel.com](https://vercel.com)
2. 用 GitHub 账号登录
3. 点击 **Add New Project**
4. 找到 `biling-ai` 仓库，点击 **Import**
5. 在 Environment Variables 中添加：
   - `OPENAI_API_KEY` = `sk-cGqfyRpuXTOMfYwtddBuJdrq5yX183G229uMbK2Uvjajgxrk`
   - `OPENAI_BASE_URL` = `https://apihub.agnes-ai.com/v1`
   - `OPENAI_MODEL` = `agnes-2.0-flash`
6. 点击 **Deploy**
7. 等待 1-2 分钟，获得公网链接

### 4. 后续更新（代码修改后自动部署）

```powershell
cd 'C:\Users\蔡国才\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a39fc34a2e01f99ebb47f13\biling-ai'
git add .
git commit -m "update: 描述你的修改"
git push
```

push 后 Vercel 会自动重新部署。

---

## 方式二：Vercel CLI（需要网络通畅）

```powershell
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd 'C:\Users\蔡国才\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a39fc34a2e01f99ebb47f13\biling-ai'
vercel

# 按提示操作，设置环境变量
```

---

## 方式三：Vercel 直接上传

1. 把 `biling-ai` 文件夹压缩成 zip
2. 打开 [vercel.com](https://vercel.com)
3. 点击 **Add New Project**
4. 选择 **Upload** 上传 zip 文件
5. 配置环境变量后 Deploy

---

## 环境变量清单

部署时必须配置以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `OPENAI_API_KEY` | `sk-cGqfyRpuXTOMfYwtddBuJdrq5yX183G229uMbK2Uvjajgxrk` | Agnes AI API Key |
| `OPENAI_BASE_URL` | `https://apihub.agnes-ai.com/v1` | Agnes AI API 地址 |
| `OPENAI_MODEL` | `agnes-2.0-flash` | 使用的模型 |

可选（Supabase 用户系统）：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL | 用户认证 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase Anon Key | 用户认证 |

---

## 项目结构

```
biling-ai/
├── src/
│   ├── app/                    # 页面和API
│   │   ├── page.tsx            # 首页：AI标题生成
│   │   ├── seo/page.tsx        # SEO分析
│   │   ├── optimize/page.tsx   # 内容优化&审校
│   │   ├── login/page.tsx      # 登录/注册
│   │   ├── api/                # API路由
│   │   │   ├── generate-titles/
│   │   │   ├── analyze-seo/
│   │   │   ├── optimize-content/
│   │   │   └── auth/callback/
│   │   └── layout.tsx
│   ├── components/             # 共享组件
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── lib/                    # 工具库
│       ├── supabase-client.ts
│       └── supabase-server.ts
├── .env.local                  # 本地环境变量（不上传）
├── .env.example                # 环境变量示例
├── vercel.json                 # Vercel 配置
├── next.config.ts
├── package.json
└── README.md
```

---

## 技术栈

- **框架**: Next.js 16 + React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **AI**: Agnes AI (`agnes-2.0-flash`)
- **认证**: Supabase Auth（预留）
- **部署**: Vercel

---

## 功能列表

- [x] AI智能标题生成（6种风格，带评分）
- [x] SEO智能分析（关键词密度、可读性、长尾词、内链建议）
- [x] 多平台内容适配（公众号、小红书、知乎、头条、百家号）
- [x] AI智能审校（错别字、语法、标点、文风）
- [x] 用户登录/注册（Supabase，预留）
- [ ] 使用次数统计
- [ ] 支付系统
- [ ] 数据看板

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开 http://localhost:3000
```

---

## 许可证

MIT
