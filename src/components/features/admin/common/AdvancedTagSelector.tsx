"use client";

import { useState, useMemo } from "react";
import { X, Search, Tag as TagIcon, Calendar } from "lucide-react";
import { Button } from "./Button";

interface Tag {
    id: number;
    name: string;
    slug?: string;
    created_at?: string;
}

interface AdvancedTagSelectorProps {
    tags: Tag[];
    onSelect: (tagId: number, tagName: string) => void;
    onClose: () => void;
    title?: string;
}

export function AdvancedTagSelector({
    tags,
    onSelect,
    onClose,
    title = "Select Tag",
}: AdvancedTagSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const filteredTags = useMemo(() => {
        let result = [...tags];

        // Search by name or slug
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((t) =>
                t.name.toLowerCase().includes(query) ||
                t.slug?.toLowerCase().includes(query)
            );
        }

        // Filter by date range
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            result = result.filter((t) => {
                if (!t.created_at) return false;
                return new Date(t.created_at) >= fromDate;
            });
        }
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter((t) => {
                if (!t.created_at) return false;
                return new Date(t.created_at) <= toDate;
            });
        }

        return result;
    }, [tags, searchQuery, dateFrom, dateTo]);

    const clearFilters = () => {
        setSearchQuery("");
        setDateFrom("");
        setDateTo("");
    };

    const hasActiveFilters = searchQuery || dateFrom || dateTo;

    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg mx-4 p-6 rounded-xl border border-(--border-color) bg-background shadow-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <TagIcon size={20} className="text-accent" />
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or slug..."
                        className="w-full pl-9 pr-3 py-2 rounded-md border border-(--border-color) bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                        autoFocus
                    />
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Calendar size={14} />
                        <span>Created:</span>
                    </div>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-md border border-(--border-color) bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    <span className="text-foreground/40">to</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-md border border-(--border-color) bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-accent hover:underline mb-3 text-left cursor-pointer"
                    >
                        Clear all filters
                    </button>
                )}

                {/* Results count */}
                <p className="text-xs text-foreground/50 mb-2">
                    {filteredTags.length} tags found
                </p>

                {/* Tags list */}
                <div className="flex-1 overflow-y-auto border border-(--border-color) rounded-lg">
                    {filteredTags.length === 0 ? (
                        <div className="p-8 text-center text-foreground/50">
                            No tags match your filters
                        </div>
                    ) : (
                        <div className="divide-y divide-(--border-color)">
                            {filteredTags.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => onSelect(t.id, t.name)}
                                    className="w-full p-3 text-left hover:bg-accent/10 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {t.name}
                                        </p>
                                        {t.slug && (
                                            <p className="text-xs text-foreground/50 font-mono mt-0.5">
                                                /{t.slug}
                                            </p>
                                        )}
                                    </div>
                                    {t.created_at && (
                                        <span className="text-xs text-foreground/40 shrink-0">
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end">
                    <Button variant="cancel" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
