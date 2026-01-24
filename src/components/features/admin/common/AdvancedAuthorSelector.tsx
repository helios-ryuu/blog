"use client";

import { useState, useMemo } from "react";
import { X, Search, Users, Calendar } from "lucide-react";
import { Button } from "./Button";

interface Author {
    id: number;
    name: string;
    title?: string;
    avatar_url?: string;
    created_at?: string;
}

interface AdvancedAuthorSelectorProps {
    authors: Author[];
    onSelect: (authorId: number, authorName: string) => void;
    onClose: () => void;
    title?: string;
}

export function AdvancedAuthorSelector({
    authors,
    onSelect,
    onClose,
    title = "Select Author",
}: AdvancedAuthorSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const filteredAuthors = useMemo(() => {
        let result = [...authors];

        // Search by name or title
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((a) =>
                a.name.toLowerCase().includes(query) ||
                a.title?.toLowerCase().includes(query)
            );
        }

        // Filter by date range
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            result = result.filter((a) => {
                if (!a.created_at) return false;
                return new Date(a.created_at) >= fromDate;
            });
        }
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter((a) => {
                if (!a.created_at) return false;
                return new Date(a.created_at) <= toDate;
            });
        }

        return result;
    }, [authors, searchQuery, dateFrom, dateTo]);

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
                        <Users size={20} className="text-accent" />
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
                        placeholder="Search by name or title..."
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
                    {filteredAuthors.length} authors found
                </p>

                {/* Authors list */}
                <div className="flex-1 overflow-y-auto border border-(--border-color) rounded-lg">
                    {filteredAuthors.length === 0 ? (
                        <div className="p-8 text-center text-foreground/50">
                            No authors match your filters
                        </div>
                    ) : (
                        <div className="divide-y divide-(--border-color)">
                            {filteredAuthors.map((a) => (
                                <button
                                    key={a.id}
                                    onClick={() => onSelect(a.id, a.name)}
                                    className="w-full p-3 text-left hover:bg-accent/10 transition-colors flex items-center gap-3 cursor-pointer"
                                >
                                    {/* Avatar */}
                                    {a.avatar_url ? (
                                        <img
                                            src={a.avatar_url}
                                            alt={a.name}
                                            className="w-10 h-10 rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                                            <Users size={16} className="text-accent" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {a.name}
                                        </p>
                                        {a.title && (
                                            <p className="text-xs text-foreground/50 mt-0.5 truncate">
                                                {a.title}
                                            </p>
                                        )}
                                    </div>
                                    {a.created_at && (
                                        <span className="text-xs text-foreground/40 shrink-0">
                                            {new Date(a.created_at).toLocaleDateString()}
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
