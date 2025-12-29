import { NextResponse } from "next/server";
import { getAllPostsMeta, getAllTags } from "@/lib/posts";

export async function GET() {
    try {
        const posts = getAllPostsMeta();
        const allTags = getAllTags();

        const searchableItems = posts.map((post) => ({
            type: "Post" as const,
            title: post.title,
            path: `/post/${post.slug}`,
            tags: post.tags || [],
        }));

        // Also include tags as searchable items
        const tagItems = allTags.map((tag) => ({
            type: "Tag" as const,
            title: tag,
            path: `/post?tag=${encodeURIComponent(tag)}`,
            tags: [] as string[],
        }));

        return NextResponse.json({ posts: searchableItems, tags: tagItems });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json({ posts: [], tags: [] });
    }
}
