import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "../../../../mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import { PostMeta, TagList } from "@/components/ui";
import { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getPostSlugs();
    return slugs.map((slug) => ({
        slug: slug.replace(/\.mdx$/, ""),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    const baseUrl = "https://blog.helios.id.vn"; // Update with your actual domain

    return {
        title: `${post.title} - Helios Blog`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            url: `${baseUrl}/post/${slug}`,
            siteName: "Helios Blog",
            images: post.image ? [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ] : [],
            locale: "vi_VN",
            type: "article",
            publishedTime: post.date,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: post.image ? [post.image] : [],
        },
    };
}

const rehypePrettyCodeOptions = {
    theme: "github-dark",
    keepBackground: true,
};

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="p-6 max-w-3xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold">{post.title}</h1>
                <p className="mt-2 text-foreground/70">{post.description}</p>
                <PostMeta date={post.date} readingTime={post.readingTime} level={post.level} className="mt-4" />
                {post.tags && <TagList tags={post.tags} />}
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRemote
                    source={post.content}
                    components={useMDXComponents({})}
                    options={{
                        mdxOptions: {
                            rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
                        },
                    }}
                />
            </div>
        </article>
    );
}
