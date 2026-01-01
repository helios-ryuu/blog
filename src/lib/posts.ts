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
        post.tags?.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
}

/**
 * Get related posts based on matching tags
 */
export function getRelatedPosts(currentSlug: string, tags: string[] = [], limit: number = 3): PostMeta[] {
    if (tags.length === 0) return [];

    const allPosts = getAllPostsMeta();

    // Score posts by number of matching tags
    const scoredPosts = allPosts
        .filter(post => post.slug !== currentSlug)
        .map(post => {
            const matchingTags = post.tags?.filter(tag =>
                tags.some(t => t.toLowerCase() === tag.toLowerCase())
            ) || [];
            return { post, score: matchingTags.length };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    return scoredPosts.slice(0, limit).map(item => item.post);
}

/**
 * Get all posts in the same series
 */
export function getSeriesPosts(seriesId: string): PostMeta[] {
    if (!seriesId) return [];

    return getAllPostsMeta()
        .filter(post => post.seriesId === seriesId)
        .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}
