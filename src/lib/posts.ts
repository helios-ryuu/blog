import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta, PostFrontmatter } from "@/types/post";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

/**
 * Get all post slugs from the content directory
 */
export function getPostSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));
}

/**
 * Get post data by slug
 */
export function getPostBySlug(slug: string): Post | null {
    const realSlug = slug.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;
    const stats = readingTime(content);

    return {
        ...frontmatter,
        slug: realSlug,
        content,
        readingTime: stats.text,
    };
}

/**
 * Get all posts metadata (without content)
 */
export function getAllPostsMeta(): PostMeta[] {
    const slugs = getPostSlugs();

    const posts = slugs
        .map((slug) => {
            const realSlug = slug.replace(/\.mdx$/, "");
            const fullPath = path.join(postsDirectory, slug);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);
            const frontmatter = data as PostFrontmatter;
            const stats = readingTime(content);

            return {
                ...frontmatter,
                slug: realSlug,
                readingTime: stats.text,
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
    return getAllPostsMeta().filter((post) =>
        post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
    const posts = getAllPostsMeta();
    const tags = new Set<string>();

    posts.forEach((post) => {
        post.tags?.forEach((tag) => tags.add(tag.toLowerCase()));
    });

    return Array.from(tags).sort();
}
