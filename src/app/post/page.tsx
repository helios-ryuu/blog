import { getAllPostsMeta, getAllTags } from "@/lib/posts";
import PostListClient from "@/components/features/post/PostListClient";
import MobileSearchBar from "@/components/layout/MobileSearchBar";
import type { Level } from "@/types/post";

export default function PostPage() {
    const posts = getAllPostsMeta();
    const allTags = getAllTags();

    // Get unique levels from posts
    const allLevels = Array.from(
        new Set(posts.map((post) => post.level).filter(Boolean))
    ) as Level[];

    return (
        <>
            {/* Mobile Search Bar - below header */}
            <MobileSearchBar />

            <div className="w-full py-4 px-4 md:py-6 md:px-10">
                {/* Centered container */}
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold">Posts</h1>
                    <p className="mt-0.5 mb-8 text-foreground/70">Thoughts, notes, and experiments about software, systems, and learning</p>

                    <PostListClient
                        posts={posts}
                        allTags={allTags}
                        allLevels={allLevels}
                    />

                    {posts.length === 0 && (
                        <p className="mt-6 text-foreground/50">No posts yet. Create your first post in src/content/posts/</p>
                    )}
                </div>
            </div>
        </>
    );
}
