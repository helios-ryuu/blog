"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { mdxComponents } from "@/../mdx-components";

interface Tag {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string;
}

interface PostPreviewPanelProps {
    title: string;
    description: string;
    imageUrl: string;
    level: string;
    readingTime: string;
    authorId: string;
    authors: Author[];
    selectedTags: number[];
    tags: Tag[];
    mdxSource: MDXRemoteSerializeResult | null;
}

export function PostPreviewPanel({
    title,
    description,
    imageUrl,
    level,
    readingTime,
    authorId,
    authors,
    selectedTags,
    tags,
    mdxSource,
}: PostPreviewPanelProps) {
    const authorName = authors.find((a) => a.id.toString() === authorId)?.name || "Unknown Author";

    const levelStyles: Record<string, string> = {
        beginner: "bg-green-500/20 text-green-500",
        intermediate: "bg-yellow-500/20 text-yellow-500",
        advanced: "bg-red-500/20 text-red-500",
    };

    return (
        <div className="w-1/2 h-full flex flex-col bg-background">
            <div className="flex items-center h-14 gap-2 p-4 border-b border-(--border-color) text-foreground/70">
                <Eye size={20} />
                <span className="font-medium">Preview</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                {/* Post Header - matching actual post page */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {title || "Untitled"}
                    </h1>
                    <p className="text-sm mt-2 text-foreground/70">
                        {description || "No description"}
                    </p>
                    {/* PostMeta style */}
                    <div className="flex items-center gap-2 text-foreground/50 text-sm mt-4 mb-3">
                        <span>{authorName}</span>
                        <span>•</span>
                        <span>{readingTime ? `${readingTime} min read` : "? min read"}</span>
                        {level && (
                            <>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-sm text-xs font-medium ${levelStyles[level] || ""}`}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </span>
                            </>
                        )}
                    </div>
                    {/* TagList style */}
                    {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {selectedTags.map((tagId) => {
                                const tag = tags.find((t) => t.id === tagId);
                                return tag ? (
                                    <span
                                        key={tag.id}
                                        className="px-2.5 py-0.5 text-xs rounded-[4px] bg-accent/20 text-accent"
                                    >
                                        {tag.name}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    )}
                </header>

                {/* Featured Image */}
                {imageUrl && (
                    <div className="mb-6 rounded-lg overflow-hidden border border-(--border-color)">
                        <Image
                            src={imageUrl}
                            alt={title}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto object-cover"
                            unoptimized
                        />
                    </div>
                )}

                {/* MDX Content */}
                <div className="prose prose-invert max-w-none">
                    {mdxSource ? (
                        <MDXRemote {...mdxSource} components={mdxComponents} />
                    ) : (
                        <p className="text-foreground/40 italic">
                            Click &quot;Preview&quot; to render content
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
