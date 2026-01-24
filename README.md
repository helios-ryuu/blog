<p align="center">
  <img src="public/favicon.ico" alt="Helios Blog Logo" width="80" />
</p>

<h1 align="center">Helios Blog</h1>
<p align="center">
  <strong>Version 1.1.1</strong>
</p>
<p align="center">
  <strong>A modern, high-performance personal blog built with Next.js 16, React 19, and Supabase.</strong>
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
- **Database-Backed Posts**: Content stored in Supabase (PostgreSQL) for scalability and easy management.
- **MDX Rendering**: Rich content with Markdown and React components via `next-mdx-remote`.
- **Syntax Highlighting**: Beautiful code blocks powered by Shiki with `rehype-pretty-code`.
- **Reading Time**: Stored per post for instant display.
- **Difficulty Levels**: Posts categorized by `Beginner`, `Intermediate`, or `Advanced`.
- **Series Support**: Group related articles with series ordering.
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
- **Download as Markdown**: Export posts as `.md` files with frontmatter.
- **Copy Link**: One-click link copying with fallback for older browsers.

### Filtering & Sorting
- **URL-Driven State**: Filters sync with URL params - shareable and bookmark-friendly.
- **Sort Options**: Order posts by Date (Newest/Oldest), Title (A-Z/Z-A), or Level.

### Administration
- **Secure Dashboard**: Password-protected admin area for content management.
- **Post Management**: CRUD operations for posts with a rich editor.
- **Tag & Series Control**: Manage taxonomies directly from the UI.
- **Real-time Preview**: Preview posts before publishing.

---

## 🛠️ Tech Stack

| Category        | Technology                                                                 |
| :-------------- | :------------------------------------------------------------------------- |
| **Framework**   | [Next.js 16](https://nextjs.org/) (App Router, Turbopack)                  |
| **Language**    | [TypeScript 5](https://www.typescriptlang.org/)                            |
| **UI Library**  | [React 19](https://react.dev/) with React Compiler                         |
| **Database**    | [Supabase](https://supabase.com/) (PostgreSQL) via `postgres` driver        |
| **Styling**     | [Tailwind CSS 4](https://tailwindcss.com/)                                 |
| **Content**     | [MDX](https://mdxjs.com/) via `next-mdx-remote`                            |
| **Animation**   | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/)                                    |
| **Icons**       | [Lucide React](https://lucide.dev/)                                        |
| **Code Syntax** | [Shiki](https://shiki.style/) + `rehype-pretty-code`                       |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or later recommended.
- **Supabase**: A Supabase project (free tier available at [supabase.com](https://supabase.com)).
- **Package Manager**: npm, yarn, pnpm, or bun.

### Installation

```bash
# Clone the repository
git clone https://github.com/helios-ryuu/blog.git
cd blog

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Connection String (found in Project Settings > Database > Connection string > URI)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### Database Schema

The blog requires the following tables:
- `post` - Blog posts with content, metadata, and relations
- `author` - Author information
- `tag` - Tags for categorization
- `series` - Series for grouping related posts
- `post_tags` - Many-to-many relation between posts and tags

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
├── src/
│   ├── app/                # Next.js App Router pages & API routes
│   │   ├── api/            # Backend API endpoints
│   │   │   ├── admin/      # Admin API routes (auth, posts, etc.)
│   │   │   ├── post/       # Post download endpoint
│   │   │   └── search/     # Search API with caching
│   │   ├── admin/          # Admin dashboard page
│   │   ├── post/           # Post listing and detail pages
│   │   └── page.tsx        # Homepage
│   ├── components/
│   │   ├── features/       # Feature-specific components (Post, etc.)
│   │   ├── layout/         # Structural components (Header, Sidebar, Footer)
│   │   └── ui/             # Reusable UI primitives (Button, Select, etc.)
│   ├── config/             # Application configuration (navigation)
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   │   ├── db.ts           # PostgreSQL connection
│   │   ├── posts.ts        # Post fetching API
│   │   ├── posts-db.ts     # Optimized database queries
│   │   └── utils.ts        # General utilities
│   ├── services/           # External service integrations
│   └── types/              # TypeScript type definitions
│       ├── database.ts     # Database schema types
│       └── post.ts         # Post domain types
├── .env                    # Environment variables (DATABASE_URL)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📝 Content Management

Posts are stored in the PostgreSQL database. To add a new post:

### Option 1: Direct Database Insert

```sql
INSERT INTO post (slug, title, description, content, image_url, level, type, author_id, reading_time, published, published_at)
VALUES (
  'your-post-slug',
  'Your Post Title',
  'A brief summary of your post.',
  '## Your MDX content here...',
  'https://your-image-url.jpg',
  'beginner',  -- or 'intermediate', 'advanced'
  'standalone', -- or 'series'
  1,  -- author_id
  '5 min read',
  true,
  NOW()
);

-- Add tags
INSERT INTO post_tags (post_id, tag_id)
SELECT (SELECT id FROM post WHERE slug = 'your-post-slug'), id
FROM tag WHERE name IN ('Tag1', 'Tag2');
```

### Option 2: Admin Dashboard

A comprehensive admin interface is available at `/admin` for managing posts, series, tags, and authors.
- **Login required**: Access is protected via a secure token system.
- **Features**: Create drafts, update existing content, manage visibility, and organize collections.

### Post Schema

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | URL-friendly identifier |
| `title` | string | Post title |
| `description` | string | Brief summary |
| `content` | text | MDX content |
| `image_url` | string | Cover image URL |
| `level` | enum | `beginner`, `intermediate`, `advanced` |
| `type` | enum | `standalone` or `series` |
| `series_id` | int? | Reference to series table |
| `series_order` | int? | Order within series |
| `author_id` | int? | Reference to author table |
| `reading_time` | string | e.g., "5 min read" |
| `published` | boolean | Visibility flag |
| `published_at` | timestamp | Publication date |

---

## 🌐 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

### Environment Variables

Set the following in your deployment platform:

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Steps

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add the `DATABASE_URL` environment variable.
4. Vercel will auto-detect Next.js and configure the build settings.
5. Deploy!

For other platforms, use `npm run build` to generate the `.next` output folder.
