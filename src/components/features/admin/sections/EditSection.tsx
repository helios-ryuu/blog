"use client";

import { useState } from "react";
import { Pencil, FileText, Users, Library } from "lucide-react";
import { SectionCard } from "../common/SectionCard";
import { AdvancedPostSelector } from "../common/AdvancedPostSelector";
import { AdvancedSeriesSelector } from "../common/AdvancedSeriesSelector";

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
    tags: { id: number; name: string; slug?: string; created_at?: string }[];
    authors: { id: number; name: string; title?: string; avatar_url?: string; created_at?: string }[];
    series: { id: number; name: string; slug?: string; description?: string; created_at?: string }[];
    onEditPost: (id: number) => void;
    onEditAuthor: (id: number) => void;
    onEditSeries?: (id: number) => void;
}

export default function EditSection({ posts, tags, authors, series, onEditPost, onEditAuthor, onEditSeries }: EditSectionProps) {
    const [showAdvancedPostSelector, setShowAdvancedPostSelector] = useState(false);
    const [showAdvancedSeriesSelector, setShowAdvancedSeriesSelector] = useState(false);

    const postOptions = posts.map((post) => ({
        value: post.id as number,
        label: `[${post.published ? "✓" : "○"}] ${post.title as string}`,
    }));

    const authorOptions = authors.map((author) => ({
        value: author.id as number,
        label: author.name as string,
    }));

    const seriesOptions = series.map((s) => ({
        value: s.id,
        label: s.name,
    }));

    const handleAdvancedPostSelect = (postId: number) => {
        setShowAdvancedPostSelector(false);
        onEditPost(postId);
    };

    const handleAdvancedSeriesSelect = (seriesId: number) => {
        setShowAdvancedSeriesSelector(false);
        onEditSeries?.(seriesId);
    };

    return (
        <>
            <div className="bg-blue-500/5 p-6 rounded-lg border border-blue-500/70">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Pencil size={20} className="text-blue-500" />
                    Edit
                </h2>
                {/* 8-column grid: Post 3/8 + Series 3/8 + Author 2/8 */}
                <div className="grid gap-4 grid-cols-4 md:grid-cols-8 auto-rows-fr">
                    {/* Post 3/8 */}
                    <SectionCard
                        title="Edit Post"
                        description="Select a post to edit"
                        className="col-span-4 md:col-span-3"
                        colorVariant="blue"
                        icon={FileText}
                        selectPlaceholder="Select a post..."
                        selectOptions={postOptions}
                        onSelectChange={(value) => value && onEditPost(parseInt(value))}
                        onSecondaryButtonClick={() => setShowAdvancedPostSelector(true)}
                        legend="✓ = Published, ○ = Draft"
                    />
                    {/* Series 3/8 */}
                    <SectionCard
                        title="Edit Series"
                        description="Modify series name/slug"
                        className="col-span-4 md:col-span-3"
                        colorVariant="blue"
                        icon={Library}
                        selectPlaceholder="Select a series..."
                        selectOptions={seriesOptions}
                        onSelectChange={(value) => value && onEditSeries?.(parseInt(value))}
                        onSecondaryButtonClick={() => setShowAdvancedSeriesSelector(true)}
                    />
                    {/* Author 2/8 = 1/4 */}
                    <SectionCard
                        title="Edit Author"
                        description="Modify author info"
                        className="col-span-4 md:col-span-2"
                        colorVariant="blue"
                        icon={Users}
                        selectPlaceholder="Select an author..."
                        selectOptions={authorOptions}
                        onSelectChange={(value) => value && onEditAuthor(parseInt(value))}
                    />
                </div>
            </div>

            {showAdvancedPostSelector && (
                <AdvancedPostSelector
                    posts={posts}
                    tags={tags}
                    title="Select Post to Edit"
                    onSelect={handleAdvancedPostSelect}
                    onClose={() => setShowAdvancedPostSelector(false)}
                />
            )}

            {showAdvancedSeriesSelector && (
                <AdvancedSeriesSelector
                    series={series}
                    title="Select Series to Edit"
                    onSelect={(seriesId) => {
                        setShowAdvancedSeriesSelector(false);
                        onEditSeries?.(seriesId);
                    }}
                    onClose={() => setShowAdvancedSeriesSelector(false)}
                />
            )}
        </>
    );
}

