"use client";

import { X, FileText, Tag, Users, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface DeletePreviewData {
    type: "post" | "tag" | "author";
    id: number;
    name: string;
    // Extra info for preview
    slug?: string;
    level?: string;
    postType?: string;
    published?: boolean;
    authorName?: string;
    tags?: string[];
}

interface DeletePreviewPopupProps {
    data: DeletePreviewData;
    onCancel: () => void;
    onConfirmDelete: () => void;
}

export default function DeletePreviewPopup({ data, onCancel, onConfirmDelete }: DeletePreviewPopupProps) {
    const icons = {
        post: FileText,
        tag: Tag,
        author: Users,
    };

    const getTypeLabel = () => {
        switch (data.type) {
            case "post": return "Post";
            case "tag": return "Tag";
            case "author": return "Author";
        }
    };

    const Icon = icons[data.type];

    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="relative w-full max-w-md mx-4 p-6 rounded-xl border border-red-500/30 bg-background shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <Icon size={20} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                            Delete {getTypeLabel()}
                        </h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1 text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                    <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">
                        You are about to delete this {data.type}. This action cannot be undone.
                    </p>
                </div>

                {/* Preview Info */}
                <div className="space-y-3 mb-6">
                    <div className="p-4 rounded-lg bg-foreground/5 border border-(--border-color)">
                        <p className="text-sm text-foreground/50 mb-1">Name</p>
                        <p className="font-medium text-foreground">{data.name}</p>
                    </div>

                    {data.type === "post" && (
                        <>
                            {data.slug && (
                                <div className="p-3 rounded-lg bg-foreground/5 border border-(--border-color)">
                                    <p className="text-sm text-foreground/50 mb-1">Slug</p>
                                    <p className="text-sm text-foreground font-mono">{data.slug}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-3">
                                {data.level && (
                                    <div className="p-3 rounded-lg bg-foreground/5 border border-(--border-color)">
                                        <p className="text-xs text-foreground/50 mb-1">Level</p>
                                        <p className="text-sm text-foreground capitalize">{data.level}</p>
                                    </div>
                                )}
                                {data.postType && (
                                    <div className="p-3 rounded-lg bg-foreground/5 border border-(--border-color)">
                                        <p className="text-xs text-foreground/50 mb-1">Type</p>
                                        <p className="text-sm text-foreground capitalize">{data.postType}</p>
                                    </div>
                                )}
                                {data.published !== undefined && (
                                    <div className="p-3 rounded-lg bg-foreground/5 border border-(--border-color)">
                                        <p className="text-xs text-foreground/50 mb-1">Status</p>
                                        <p className={`text-sm ${data.published ? "text-green-500" : "text-yellow-500"}`}>
                                            {data.published ? "Published" : "Draft"}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {data.authorName && (
                                <div className="p-3 rounded-lg bg-foreground/5 border border-(--border-color)">
                                    <p className="text-xs text-foreground/50 mb-1">Author</p>
                                    <p className="text-sm text-foreground">{data.authorName}</p>
                                </div>
                            )}
                            {data.tags && data.tags.length > 0 && (
                                <div className="p-3 rounded-lg bg-foreground/5 border border-(--border-color)">
                                    <p className="text-xs text-foreground/50 mb-1">Tags</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {data.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="cancel"
                        className="flex-1"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        className="flex-1"
                        onClick={onConfirmDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
