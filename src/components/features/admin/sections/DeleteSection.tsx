"use client";

import { useState } from "react";
import { Trash2, FileText, Tag, Users, Library } from "lucide-react";
import { SectionCard } from "../common/SectionCard";
import { AdvancedPostSelector } from "../common/AdvancedPostSelector";
import { AdvancedSeriesSelector } from "../common/AdvancedSeriesSelector";
import { AdvancedTagSelector } from "../common/AdvancedTagSelector";
import { AdvancedAuthorSelector } from "../common/AdvancedAuthorSelector";
import DeletePreviewPopup from "../common/DeletePreviewPopup";

interface DeleteConfirmData {
    type: "post" | "tag" | "author" | "series";
    id: number;
    name: string;
    relatedPostsCount?: number;
}

interface DeletePreviewData {
    type: "post" | "tag" | "author" | "series";
    id: number;
    name: string;
    slug?: string;
    level?: string;
    postType?: string;
    published?: boolean;
    authorName?: string;
    tags?: string[];
    relatedPostsCount?: number;
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
    series_id?: number;
    [key: string]: unknown;
}

interface DeleteSectionProps {
    posts: Post[];
    tags: { id: number; name: string; slug?: string; created_at?: string }[];
    authors: { id: number; name: string; title?: string; avatar_url?: string; created_at?: string }[];
    series: { id: number; name: string; slug: string; description?: string; created_at?: string }[];
    onDeleteConfirm: (data: DeleteConfirmData) => void;
}

export default function DeleteSection({ posts, tags, authors, series, onDeleteConfirm }: DeleteSectionProps) {
    const [showAdvancedPostSelector, setShowAdvancedPostSelector] = useState(false);
    const [showAdvancedSeriesSelector, setShowAdvancedSeriesSelector] = useState(false);
    const [showAdvancedTagSelector, setShowAdvancedTagSelector] = useState(false);
    const [showAdvancedAuthorSelector, setShowAdvancedAuthorSelector] = useState(false);
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

    const handleAdvancedPostSelect = (postId: number) => {
        setShowAdvancedPostSelector(false);
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

    const handleSeriesSelect = async (seriesId: string) => {
        if (!seriesId) return;
        const selectedSeries = series.find((s) => String(s.id) === seriesId);
        if (selectedSeries) {
            // Get related posts count
            const relatedPosts = posts.filter((p) => p.series_id === selectedSeries.id);
            setPreviewData({
                type: "series",
                id: selectedSeries.id,
                name: selectedSeries.name,
                slug: selectedSeries.slug,
                relatedPostsCount: relatedPosts.length,
            });
        }
    };

    const handleAdvancedSeriesSelect = (seriesId: number) => {
        setShowAdvancedSeriesSelector(false);
        const selectedSeries = series.find((s) => s.id === seriesId);
        if (selectedSeries) {
            const relatedPosts = posts.filter((p) => p.series_id === selectedSeries.id);
            setPreviewData({
                type: "series",
                id: selectedSeries.id,
                name: selectedSeries.name,
                slug: selectedSeries.slug,
                relatedPostsCount: relatedPosts.length,
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
                relatedPostsCount: previewData.relatedPostsCount,
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

    const seriesOptions = series.map((s) => ({
        value: s.id,
        label: s.name,
    }));

    return (
        <>
            <div className="bg-red-500/5 p-6 rounded-lg border border-red-500/70">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Trash2 size={20} className="text-red-500" />
                    Delete
                </h2>
                <div className="grid gap-4 grid-cols-4 auto-rows-fr">
                    {/* Row 1: Post 3/4 + Author 1/4 */}
                    <SectionCard
                        title="Delete Post"
                        description="Select a post to delete"
                        className="col-span-4 md:col-span-3"
                        colorVariant="red"
                        icon={FileText}
                        selectPlaceholder="Select a post..."
                        selectOptions={postOptions}
                        onSelectChange={handlePostSelect}
                        onSecondaryButtonClick={() => setShowAdvancedPostSelector(true)}
                    />
                    <SectionCard
                        title="Delete Author"
                        description="Select an author to delete"
                        className="col-span-4 md:col-span-1"
                        colorVariant="red"
                        icon={Users}
                        selectPlaceholder="Select an author..."
                        selectOptions={authorOptions}
                        onSelectChange={handleAuthorSelect}
                        onSecondaryButtonClick={() => setShowAdvancedAuthorSelector(true)}
                    />
                    {/* Row 2: Series 3/4 + Tag 1/4 */}
                    <SectionCard
                        title="Delete Series"
                        description="Delete series and all related posts"
                        className="col-span-4 md:col-span-3"
                        colorVariant="red"
                        icon={Library}
                        selectPlaceholder="Select a series..."
                        selectOptions={seriesOptions}
                        onSelectChange={handleSeriesSelect}
                        onSecondaryButtonClick={() => setShowAdvancedSeriesSelector(true)}
                    />
                    <SectionCard
                        title="Delete Tag"
                        description="Select a tag to delete"
                        className="col-span-4 md:col-span-1"
                        colorVariant="red"
                        icon={Tag}
                        selectPlaceholder="Select a tag..."
                        selectOptions={tagOptions}
                        onSelectChange={handleTagSelect}
                        onSecondaryButtonClick={() => setShowAdvancedTagSelector(true)}
                    />
                </div>
            </div>

            {showAdvancedPostSelector && (
                <AdvancedPostSelector
                    posts={posts}
                    tags={tags}
                    title="Select Post to Delete"
                    onSelect={handleAdvancedPostSelect}
                    onClose={() => setShowAdvancedPostSelector(false)}
                />
            )}

            {showAdvancedSeriesSelector && (
                <AdvancedSeriesSelector
                    series={series}
                    title="Select Series to Delete"
                    onSelect={(seriesId) => {
                        setShowAdvancedSeriesSelector(false);
                        const selectedSeries = series.find((s) => s.id === seriesId);
                        if (selectedSeries) {
                            const relatedPosts = posts.filter((p) => p.series_id === selectedSeries.id);
                            setPreviewData({
                                type: "series",
                                id: selectedSeries.id,
                                name: selectedSeries.name,
                                slug: selectedSeries.slug,
                                relatedPostsCount: relatedPosts.length,
                            });
                        }
                    }}
                    onClose={() => setShowAdvancedSeriesSelector(false)}
                />
            )}

            {showAdvancedTagSelector && (
                <AdvancedTagSelector
                    tags={tags}
                    title="Select Tag to Delete"
                    onSelect={(tagId, tagName) => {
                        setShowAdvancedTagSelector(false);
                        setPreviewData({
                            type: "tag",
                            id: tagId,
                            name: tagName,
                        });
                    }}
                    onClose={() => setShowAdvancedTagSelector(false)}
                />
            )}

            {showAdvancedAuthorSelector && (
                <AdvancedAuthorSelector
                    authors={authors}
                    title="Select Author to Delete"
                    onSelect={(authorId, authorName) => {
                        setShowAdvancedAuthorSelector(false);
                        setPreviewData({
                            type: "author",
                            id: authorId,
                            name: authorName,
                        });
                    }}
                    onClose={() => setShowAdvancedAuthorSelector(false)}
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
