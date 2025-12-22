import { PostCard } from "@/components/ui";
import { getAllPostsMeta } from "@/lib/posts";
import Link from "next/link";

export default function BlogPage() {
    const posts = getAllPostsMeta();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Blog</h1>
            <p className="mt-2 text-foreground/70">All posts</p>

            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                        <PostCard
                            image={post.image}
                            author={post.author}
                            authorTitle={post.authorTitle}
                            title={post.title}
                            description={post.description}
                            date={post.date}
                            readingTime={post.readingTime}
                            tags={post.tags}
                        />
                    </Link>
                ))}
            </div>

            {posts.length === 0 && (
                <p className="mt-6 text-foreground/50">No posts yet. Create your first post in src/content/posts/</p>
            )}
        </div>
    );
}
