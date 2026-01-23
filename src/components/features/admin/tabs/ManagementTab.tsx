"use client";

import { RefreshCw } from "lucide-react";
import CreateSection from "../sections/CreateSection";
import DraftPostsSection from "../sections/DraftPostsSection";
import EditSection from "../sections/EditSection";
import DeleteSection from "../sections/DeleteSection";
import { Button } from "../common/Button";

interface DraftPost {
    id: number;
    slug: string;
    title: string;
    description: string;
    image_url: string;
    level: string;
    type: string;
    created_at: string;
    updated_at: string;
    author_name: string | null;
    series_name: string | null;
    series_order: number | null;
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

interface DeleteConfirmData {
    type: "post" | "tag" | "author";
    id: number;
    name: string;
}

interface ManagementTabProps {
    posts: Post[];
    tags: { id: number; name: string }[];
    authors: Record<string, unknown>[];
    draftPosts: DraftPost[];
    draftsLoading: boolean;
    isLoading?: boolean;
    onRefresh: () => void;
    onAddPost: () => void;
    onAddTag: () => void;
    onAddAuthor: () => void;
    onEditDraft: (id: number) => void;
    onEditPost: (id: number) => void;
    onEditAuthor: (id: number) => void;
    onDeleteConfirm: (data: DeleteConfirmData) => void;
}

export default function ManagementTab({
    posts,
    tags,
    authors,
    draftPosts,
    draftsLoading,
    isLoading,
    onRefresh,
    onAddPost,
    onAddTag,
    onAddAuthor,
    onEditDraft,
    onEditPost,
    onEditAuthor,
    onDeleteConfirm,
}: ManagementTabProps) {
    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Post Management</h2>
                <Button
                    variant="utility"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isLoading || draftsLoading}
                    isLoading={isLoading || draftsLoading}
                    loadingText="Loading..."
                    icon={<RefreshCw size={14} />}
                >
                    Refresh
                </Button>
            </div>

            <CreateSection
                onAddPost={onAddPost}
                onAddTag={onAddTag}
                onAddAuthor={onAddAuthor}
            />

            <DraftPostsSection
                draftPosts={draftPosts}
                isLoading={draftsLoading}
                onEditDraft={onEditDraft}
            />

            <EditSection
                posts={posts}
                tags={tags}
                authors={authors}
                onEditPost={onEditPost}
                onEditAuthor={onEditAuthor}
            />

            <DeleteSection
                posts={posts}
                tags={tags}
                authors={authors}
                onDeleteConfirm={onDeleteConfirm}
            />
        </div>
    );
}
