"use client";

import { useState, useMemo } from "react";
import { X, Search, Filter, Calendar } from "lucide-react";
import { FormSelectDropdown } from "./FormFields";
import { Button } from "./Button";

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

interface AdvancedPostSelectorProps {
    posts: Post[];
    tags?: { id: number; name: string }[];
    onSelect: (postId: number, postTitle: string) => void;
    onClose: () => void;
    title?: string;
}

const LEVELS = ["beginner", "intermediate", "advanced"];
const TYPES = ["standalone", "series"];
const STATUSES = ["all", "published", "draft"];

export function AdvancedPostSelector({
    posts,
    tags = [],
    onSelect,
    onClose,
    title = "Select Post",
}: AdvancedPostSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [tagFilter, setTagFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // Search by title
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((post) =>
                post.title.toLowerCase().includes(query)
            );
        }

        // Filter by level
        if (levelFilter) {
            result = result.filter((post) => post.level === levelFilter);
        }

        // Filter by type
        if (typeFilter) {
            result = result.filter((post) => (post.type || "standalone") === typeFilter);
        }

        // Filter by status
        if (statusFilter === "published") {
            result = result.filter((post) => post.published === true);
        } else if (statusFilter === "draft") {
            result = result.filter((post) => post.published !== true);
        }

        // Filter by tag
        if (tagFilter) {
            result = result.filter((post) => 
                post.tags?.some(t => t.toLowerCase() === tagFilter.toLowerCase())
            );
        }

        // Filter by date range
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            result = result.filter((post) => {
                if (!post.created_at) return false;
                return new Date(post.created_at) >= fromDate;
            });
        }
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            result = result.filter((post) => {
                if (!post.created_at) return false;
                return new Date(post.created_at) <= toDate;
            });
        }

        return result;
    }, [posts, searchQuery, levelFilter, typeFilter, statusFilter, tagFilter, dateFrom, dateTo]);

    const clearFilters = () => {
        setSearchQuery("");
        setLevelFilter("");
        setTypeFilter("");
        setStatusFilter("all");
        setTagFilter("");
        setDateFrom("");
        setDateTo("");
    };

    const hasActiveFilters = searchQuery || levelFilter || typeFilter || statusFilter !== "all" || tagFilter || dateFrom || dateTo;

    // Get unique tags from posts if tags prop not provided
    const availableTags = useMemo(() => {
        if (tags.length > 0) {
            return tags.map(t => ({ value: t.name, label: t.name }));
        }
        const tagSet = new Set<string>();
        posts.forEach(post => {
            post.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort().map(t => ({ value: t, label: t }));
    }, [posts, tags]);

    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl mx-4 p-6 rounded-xl border border-(--border-color) bg-background shadow-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Filter size={20} className="text-accent" />
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-foreground/50 hover:text-foreground transition-colors"
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
                        placeholder="Search by title..."
                        className="w-full pl-9 pr-3 py-2 rounded-md border border-(--border-color) bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                        autoFocus
                    />
                </div>

                {/* Filters Row 1 */}
                <div className="grid grid-cols-4 gap-3 mb-3">
                    <FormSelectDropdown
                        value={levelFilter}
                        onChange={setLevelFilter}
                        placeholder="All Levels"
                        options={[
                            { value: "", label: "All Levels" },
                            ...LEVELS.map((l) => ({
                                value: l,
                                label: l.charAt(0).toUpperCase() + l.slice(1),
                            })),
                        ]}
                    />
                    <FormSelectDropdown
                        value={typeFilter}
                        onChange={setTypeFilter}
                        placeholder="All Types"
                        options={[
                            { value: "", label: "All Types" },
                            ...TYPES.map((t) => ({
                                value: t,
                                label: t.charAt(0).toUpperCase() + t.slice(1),
                            })),
                        ]}
                    />
                    <FormSelectDropdown
                        value={statusFilter}
                        onChange={setStatusFilter}
                        placeholder="All Status"
                        options={STATUSES.map((s) => ({
                            value: s,
                            label: s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1),
                        }))}
                    />
                    <FormSelectDropdown
                        value={tagFilter}
                        onChange={setTagFilter}
                        placeholder="All Tags"
                        options={[
                            { value: "", label: "All Tags" },
                            ...availableTags,
                        ]}
                    />
                </div>

                {/* Filters Row 2 - Date Range */}
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
                        className="text-sm text-accent hover:underline mb-3 text-left"
                    >
                        Clear all filters
                    </button>
                )}

                {/* Results count */}
                <p className="text-xs text-foreground/50 mb-2">
                    {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} found
                </p>

                {/* Post list */}
                <div className="flex-1 overflow-y-auto border border-(--border-color) rounded-lg">
                    {filteredPosts.length === 0 ? (
                        <div className="p-8 text-center text-foreground/50">
                            No posts match your filters
                        </div>
                    ) : (
                        <div className="divide-y divide-(--border-color)">
                            {filteredPosts.map((post) => (
                                <button
                                    key={post.id}
                                    onClick={() => onSelect(post.id, post.title)}
                                    className="w-full p-3 text-left hover:bg-accent/10 transition-colors flex items-center justify-between gap-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                                                post.published 
                                                    ? "bg-green-500/20 text-green-500" 
                                                    : "bg-yellow-500/20 text-yellow-500"
                                            }`}>
                                                {post.published ? "Published" : "Draft"}
                                            </span>
                                            <span className="text-xs text-foreground/40 capitalize">
                                                {post.level}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-foreground truncate mt-1">
                                            {post.title}
                                        </p>
                                        {post.author_name && (
                                            <p className="text-xs text-foreground/50 mt-0.5">
                                                by {post.author_name}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs text-foreground/40 capitalize shrink-0">
                                        {post.type || "standalone"}
                                    </span>
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
