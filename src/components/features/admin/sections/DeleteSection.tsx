"use client";

import { useState } from "react";
import { Trash2, FileText, Tag, Users } from "lucide-react";
import { SectionCard } from "../common/SectionCard";
import { AdvancedPostSelector } from "../common/AdvancedPostSelector";
import DeletePreviewPopup from "../common/DeletePreviewPopup";

interface DeleteConfirmData {
    type: "post" | "tag" | "author";
    id: number;
    name: string;
}

interface DeletePreviewData {
    type: "post" | "tag" | "author";
    id: number;
    name: string;
    slug?: string;
    level?: string;
    postType?: string;
    published?: boolean;
    authorName?: string;
    tags?: string[];
}

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

interface DeleteSectionProps {
    posts: Post[];
    tags: { id: number; name: string }[];
    authors: Record<string, unknown>[];
    onDeleteConfirm: (data: DeleteConfirmData) => void;
}

export default function DeleteSection({ posts, tags, authors, onDeleteConfirm }: DeleteSectionProps) {
    const [showAdvancedSelector, setShowAdvancedSelector] = useState(false);
    const [previewData, setPreviewData] = useState<DeletePreviewData | null>(null);

    const handlePostSelect = (postId: string) => {
        if (!postId) return;
        const post = posts.find((p) => String(p.id) === postId);
        if (post) {
            setPreviewData({
                type: "post",
                id: post.id,
                name: post.title,
                slug: post.slug,
                level: post.level,
                postType: post.type,
                published: post.published,
                authorName: post.author_name || undefined,
                tags: post.tags,
            });
        }
    };

    const handleAdvancedSelect = (postId: number) => {
        setShowAdvancedSelector(false);
        const post = posts.find((p) => p.id === postId);
        if (post) {
            setPreviewData({
                type: "post",
                id: post.id,
                name: post.title,
                slug: post.slug,
                level: post.level,
                postType: post.type,
                published: post.published,
                authorName: post.author_name || undefined,
                tags: post.tags,
            });
        }
    };

    const handleTagSelect = (tagId: string) => {
        if (!tagId) return;
        const tag = tags.find((t) => String(t.id) === tagId);
        if (tag) {
            setPreviewData({
                type: "tag",
                id: tag.id,
                name: tag.name,
            });
        }
    };

    const handleAuthorSelect = (authorId: string) => {
        if (!authorId) return;
        const author = authors.find((a) => String(a.id) === authorId);
        if (author) {
            setPreviewData({
                type: "author",
                id: author.id as number,
                name: author.name as string,
            });
        }
    };

    const handleConfirmDelete = () => {
        if (previewData) {
            onDeleteConfirm({
                type: previewData.type,
                id: previewData.id,
                name: previewData.name,
            });
            setPreviewData(null);
        }
    };

    const postOptions = posts.map((post) => ({
        value: post.id as number,
        label: post.title as string,
    }));

    const tagOptions = tags.map((tag) => ({
        value: tag.id as number,
        label: tag.name as string,
    }));

    const authorOptions = authors.map((author) => ({
        value: author.id as number,
        label: author.name as string,
    }));

    return (
        <>
            <div className="bg-red-500/5 p-6 rounded-lg border border-red-500/70">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Trash2 size={20} className="text-red-500" />
                    Delete
                </h2>
                <div className="grid gap-4 grid-cols-4 auto-rows-fr">
                    <SectionCard
                        title="Delete Post"
                        description="Select a post to delete"
                        className="col-span-4 md:col-span-2"
                        colorVariant="red"
                        icon={FileText}
                        selectPlaceholder="Select a post..."
                        selectOptions={postOptions}
                        onSelectChange={handlePostSelect}
                        onSecondaryButtonClick={() => setShowAdvancedSelector(true)}
                    />
                    <SectionCard
                        title="Delete Tag"
                        description="Select a tag to delete"
                        className="col-span-2 md:col-span-1"
                        colorVariant="red"
                        icon={Tag}
                        selectPlaceholder="Select a tag..."
                        selectOptions={tagOptions}
                        onSelectChange={handleTagSelect}
                    />
                    <SectionCard
                        title="Delete Author"
                        description="Select an author to delete"
                        className="col-span-2 md:col-span-1"
                        colorVariant="red"
                        icon={Users}
                        selectPlaceholder="Select an author..."
                        selectOptions={authorOptions}
                        onSelectChange={handleAuthorSelect}
                    />
                </div>
            </div>
            
            {showAdvancedSelector && (
                <AdvancedPostSelector
                    posts={posts}
                    tags={tags}
                    title="Select Post to Delete"
                    onSelect={handleAdvancedSelect}
                    onClose={() => setShowAdvancedSelector(false)}
                />
            )}

            {previewData && (
                <DeletePreviewPopup
                    data={previewData}
                    onCancel={() => setPreviewData(null)}
                    onConfirmDelete={handleConfirmDelete}
                />
            )}
        </>
    );
}
