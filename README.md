<p align="center">
  <img src="public/favicon.ico" alt="Helios Blog Logo" width="80" />
</p>

<h1 align="center">Helios Blog</h1>
<p align="center">
  <strong>A modern, high-performance personal blog built with Next.js 16 and React 19.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#content-management">Content</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## ✨ Features

### Content & Reading Experience
- **MDX-Powered Articles**: Write rich content with Markdown and React components.
- **Syntax Highlighting**: Beautiful code blocks powered by Shiki with `rehype-pretty-code`.
- **Reading Time Estimation**: Automatically calculated for each post.
- **Difficulty Levels**: Posts are categorized by `Beginner`, `Intermediate`, or `Advanced`.
- **Series Support**: Group related articles together with series ordering.
- **Tag System**: Filter and discover content easily.

### User Interface
- **Responsive Design**: Optimized for all devices from mobile to desktop.
- **Dark/Light Themes**: Seamless theme switching with `next-themes`.
- **Card & List Views**: Toggle between visual layouts for browsing posts.
- **Animated Dot Grid**: Interactive, GPU-accelerated background on the homepage.
- **Framer Motion Animations**: Smooth transitions and micro-interactions.
- **Collapsible Sidebar**: Pin or auto-hide navigation for focused reading.

### Sharing & Downloads
- **QR Code Sharing**: Generate a shareable card with a QR code for any post.
- **Download as Markdown**: Export the raw `.md` source of any article.
- **Copy Link**: One-click link copying with fallback for older browsers.

### Filtering & Sorting
- **Persistent Filters**: Tag, Level, and Type filters sync with URL and persist on reload.
- **Sort Options**: Order posts by Date (Newest/Oldest), Title (A-Z/Z-A), or Level.

---

## 🛠️ Tech Stack

| Category        | Technology                                                                 |
| :-------------- | :------------------------------------------------------------------------- |
| **Framework**   | [Next.js 16](https://nextjs.org/) (App Router)                             |
| **Language**    | [TypeScript 5](https://www.typescriptlang.org/)                            |
| **UI Library**  | [React 19](https://react.dev/)                                             |
| **Styling**     | [Tailwind CSS 4](https://tailwindcss.com/)                                 |
| **Content**     | [MDX](https://mdxjs.com/) via `next-mdx-remote`                            |
| **Animation**   | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/)                                    |
| **Icons**       | [Lucide React](https://lucide.dev/)                                        |
| **Code Syntax** | [Shiki](https://shiki.style/) + `rehype-pretty-code`                       |
| **Maps**        | [MapLibre GL](https://maplibre.org/)                                       |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or later recommended.
- **Package Manager**: npm, yarn, pnpm, or bun.

### Installation

```bash
# Clone the repository
git clone https://github.com/helios-ryuu/blog.git
cd blog

# Install dependencies
npm install
```

### Development

```bash
# Start the development server (runs on port 3456)
npm run dev
```
Open [http://localhost:3456](http://localhost:3456) in your browser.

### Production Build

```bash
# Create an optimized production build
npm run build

# Start the production server
npm run start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
blog/
├── public/                 # Static assets (images, favicon)
│   └── post-images/        # Images for blog posts
├── src/
│   ├── app/                # Next.js App Router pages & API routes
│   │   ├── api/            # Backend API endpoints
│   │   ├── post/           # Post listing and detail pages
│   │   └── page.tsx        # Homepage
│   ├── components/
│   │   ├── features/       # Feature-specific components (Post, etc.)
│   │   ├── layout/         # Structural components (Header, Sidebar, Footer)
│   │   └── ui/             # Reusable UI primitives (Button, Select, etc.)
│   ├── config/             # Application configuration (navigation)
│   ├── content/
│   │   └── posts/          # MDX blog post files
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions (post fetching, etc.)
│   ├── services/           # External service integrations
│   └── types/              # TypeScript type definitions
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 📝 Content Management

### Creating a New Post

1.  Create a new `.mdx` file in `src/content/posts/`.
2.  Add the required frontmatter:

```mdx
---
author: "Your Name"
authorTitle: "Your Title"
title: "Your Post Title"
description: "A brief summary of your post."
date: "YYYY-MM-DD"
image: "/post-images/your-image.jpg"
tags: ["Tag1", "Tag2"]
level: "beginner" # or "intermediate", "advanced"
type: "standalone" # or "series"
seriesOrder: 1 # Only if type is "series"
---

Your content here...
```

3.  Add your cover image to `public/post-images/`.
4.  The post will automatically appear on the site.

---

## 🌐 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your repository to GitHub.
2.  Import the project in Vercel.
3.  Vercel will auto-detect Next.js and configure the build settings.
4.  Deploy!

For other platforms, use `npm run build` to generate the `.next` output folder.
