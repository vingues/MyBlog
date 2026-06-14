# Vingues' Blog

基于 [Astro](https://astro.build) 构建的个人博客，专注于技术分享与思考记录。

**在线访问**: [https://vingues.github.io/MyBlog/](https://vingues.github.io/MyBlog/)

## 技术栈

| 技术 | 说明 |
|------|------|
| [Astro](https://astro.build) v5 | 核心框架，静态站点生成 |
| [GitHub Pages](https://pages.github.com) | 托管平台 |
| [GitHub Actions](https://docs.github.com/actions) | CI/CD 自动部署 |
| Markdown | 内容编写 |
| Shiki | 代码高亮 (github-light 主题) |

## 项目结构

```
blog/
├── public/                      # 静态资源（直接复制到构建输出）
│   ├── avatar.jpg               # 头像
│   ├── favicon.svg              # 网站图标（紫色渐变 V）
│   └── .nojekyll                # 禁用 Jekyll 构建
├── src/
│   ├── content/
│   │   └── blog/                # 博客文章（Markdown）
│   │       ├── astro-islands.md
│   │       ├── harness-introduction.md
│   │       ├── hello-world.md
│   │       └── typescript-tips.md
│   ├── layouts/
│   │   └── BaseLayout.astro     # 全局布局（导航栏、底部、全局样式）
│   ├── pages/
│   │   ├── index.astro          # 首页
│   │   └── blog/
│   │       ├── index.astro      # 文章列表页
│   │       └── [...slug].astro  # 文章详情页（动态路由）
│   └── content.config.ts        # 内容集合 Schema 定义
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions 部署工作流
├── astro.config.mjs             # Astro 配置
├── package.json
└── tsconfig.json
```

## 核心实现

### 1. 内容集合 (Content Collections)

使用 Astro 的 Content Collections 管理博客文章，通过 Zod Schema 定义文章元数据：

```typescript
// src/content.config.ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});
```

每篇文章的 frontmatter 格式：

```yaml
---
title: "文章标题"
description: "文章描述"
pubDate: 2026-06-14T18:35:00+08:00
tags: ["标签1", "标签2"]
---
```

### 2. 动态路由

使用 `[...slug].astro` 实现文章详情页的动态路由：

```typescript
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
```

访问 `/blog/hello-world/` 即可查看对应文章。

### 3. 全局布局

`BaseLayout.astro` 提供统一的页面结构：

- **导航栏**: 头像 + Logo + 导航链接
- **主内容区**: 通过 `<slot />` 插入页面内容
- **底部**: 版权信息
- **全局样式**: CSS 变量、动画、响应式设计

### 4. 响应式设计

- 移动端自适应布局
- 网格布局自动调整列数
- 导航栏在小屏下优化显示

### 5. CI/CD 自动部署

推送到 `main` 分支后，GitHub Actions 自动：

1. 检出代码
2. 安装依赖 (`npm ci`)
3. 构建静态文件 (`npm run build`)
4. 部署到 GitHub Pages

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:4321）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 添加新文章

在 `src/content/blog/` 目录下创建新的 `.md` 文件：

```markdown
---
title: "我的新文章"
description: "文章描述"
pubDate: 2026-06-15T10:00:00+08:00
tags: ["前端", "Astro"]
---

## 正文内容

在这里写你的文章...
```

保存后开发服务器会自动热更新。

## 自定义配置

修改 `astro.config.mjs` 可调整：

```typescript
export default defineConfig({
  site: 'https://vingues.github.io',  // 站点地址
  base: '/MyBlog',                     // 基础路径
  markdown: {
    shikiConfig: {
      theme: 'github-light',           // 代码高亮主题
      wrap: true,
    },
  },
});
```

## 部署

1. Fork 或克隆本仓库
2. 修改 `astro.config.mjs` 中的 `site` 和 `base` 为你的配置
3. 推送到 GitHub
4. 在仓库 Settings → Pages 中选择 Source 为 **GitHub Actions**
5. 推送代码后自动部署

## License

MIT
