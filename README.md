# XVVQAQ's Blog

个人博客，基于 [Astro](https://astro.build) 构建，使用 [Svelte](https://svelte.dev) 交互组件。

## 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | [Astro](https://astro.build) v6 |
| UI 组件 | [Svelte](https://svelte.dev) v5 |
| 样式 | SCSS，Material Design / Flutter 风格 |
| 内容管理 | Astro Content Collections（Markdown） |
| 代码高亮 | [Expressive Code](https://expressive-code.com) |
| 搜索 | [Pagefind](https://pagefind.app) |
| RSS | 内置 Atom / RSS 2.0 |
| 图标 | [unplugin-icons](https://github.com/unplugin/unplugin-icons) |

## 项目结构

```
src/
├── components/
│   ├── Control/         # 分页
│   ├── Layout/          # 布局组件（Header, Footer, Buttons）
│   ├── Misc/            # 通用组件（TagList, PostHeader）
│   └── Widgets/         # 小部件（TOC）
├── layouts/
│   ├── Layout.astro     # 主布局
│   └── Head.astro       # <head>
├── pages/
│   ├── [...page].astro  # 文章列表（分页）
│   ├── about.astro      # 关于页
│   └── posts/
│       └── [...slug].astro  # 文章详情
├── styles/
│   ├── _scrollbar.scss  # 滚动条样式（partial）
│   ├── _shared.scss     # 共享变量/混入（partial）
│   ├── global.scss      # 全局样式
│   └── markdown.scss    # 文章内容样式
├── content.config.ts    # Content Collections 配置
├── utils/
│   └── content.ts       # 内容工具函数
└── config.ts            # 站点配置

content/
├── blogs/               # 博客文章（Markdown）
└── pages/               # 独立页面（如 about.md）

packages/
└── rehype-code-wrapper/ # 代码块增强（语言标签、图标）
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动 dev server
pnpm dev

# 构建静态站点
pnpm build
```

## 设计风格

Material Design 风格，特征：

- **小圆角**：`--radius-xs: 4px`（卡片、按钮、标签、代码块）
- **浅阴影**：`--elevation-1` / `--elevation-2` 替代厚重边框
- **双色文字**：`--text-color`（主色）、`--text-secondary`（辅助色）
- **暗色模式**：跟随 `data-theme` 属性切换

## License

- **项目代码**：MIT License（详见 [LICENSE](./LICENSE)）
- **文章内容**（`content/` 目录下所有文件）：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
