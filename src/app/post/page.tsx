import { PostCard } from "@/components/ui";
import { getAllPostsMeta } from "@/lib/posts";
import Link from "next/link";

export default function PostPage() {
    const posts = getAllPostsMeta();

    return (
        <div className="py-10 px-6">
            {/* Centered container */}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold">Posts</h1>
                <p className="mt-2 text-foreground/70">All posts</p>

                {/* Posts grid - justify-start but container centered */}
                <div className="mt-6 flex flex-wrap gap-6 justify-start">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/post/${post.slug}`}>
                            <PostCard
                                image={post.image}
                                author={post.author}
                                authorTitle={post.authorTitle}
                                title={post.title}
                                description={post.description}
                                date={post.date}
                                readingTime={post.readingTime}
                                level={post.level}
                                tags={post.tags}
                            />
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <p className="mt-6 text-foreground/50">No posts yet. Create your first post in src/content/posts/</p>
                )}
            </div>
        </div>
    );
}
