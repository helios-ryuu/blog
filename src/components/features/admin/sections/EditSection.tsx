"use client";

import { useState } from "react";
import { Pencil, FileText, Users } from "lucide-react";
import { SectionCard } from "../common/SectionCard";
import { AdvancedPostSelector } from "../common/AdvancedPostSelector";

interface Post {
    id: number;
    title: string;
    slug?: string;
    published?: boolean;
    level?: string;
    type?: string;
    author_name?: string | null;
    tags?: string[];
    created_at?: string;
    [key: string]: unknown;
}

interface EditSectionProps {
    posts: Post[];
    tags: { id: number; name: string }[];
    authors: Record<string, unknown>[];
    onEditPost: (id: number) => void;
    onEditAuthor: (id: number) => void;
}

export default function EditSection({ posts, tags, authors, onEditPost, onEditAuthor }: EditSectionProps) {
    const [showAdvancedSelector, setShowAdvancedSelector] = useState(false);
    
    const postOptions = posts.map((post) => ({
        value: post.id as number,
        label: `[${post.published ? "✓" : "○"}] ${post.title as string}`,
    }));

    const authorOptions = authors.map((author) => ({
        value: author.id as number,
        label: author.name as string,
    }));

    const handleAdvancedSelect = (postId: number) => {
        setShowAdvancedSelector(false);
        onEditPost(postId);
    };

    return (
        <>
            <div className="bg-blue-500/5 p-6 rounded-lg border border-blue-500/70">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Pencil size={20} className="text-blue-500" />
                    Edit
                </h2>
                <div className="grid gap-4 grid-cols-4 auto-rows-fr">
                    <SectionCard
                        title="Edit Post"
                        description="Select a post to edit (drafts and published)"
                        className="col-span-4 md:col-span-3"
                        colorVariant="blue"
                        icon={FileText}
                        selectPlaceholder="Select a post..."
                        selectOptions={postOptions}
                        onSelectChange={(value) => value && onEditPost(parseInt(value))}
                        onSecondaryButtonClick={() => setShowAdvancedSelector(true)}
                        legend="✓ = Published, ○ = Draft"
                    />
                    <SectionCard
                        title="Edit Author"
                        description="Modify author information"
                        className="col-span-4 md:col-span-1"
                        colorVariant="blue"
                        icon={Users}
                        selectPlaceholder="Select an author..."
                        selectOptions={authorOptions}
                        onSelectChange={(value) => value && onEditAuthor(parseInt(value))}
                    />
                </div>
            </div>
            
            {showAdvancedSelector && (
                <AdvancedPostSelector
                    posts={posts}
                    tags={tags}
                    title="Select Post to Edit"
                    onSelect={handleAdvancedSelect}
                    onClose={() => setShowAdvancedSelector(false)}
                />
            )}
        </>
    );
}
