"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PostCard, PostListItem } from "@/components/features/post";
import Select from "@/components/ui/Select";
import MultiSelect from "@/components/ui/MultiSelect";
import { Button } from "@/components/ui";
import TagList from "@/components/ui/TagList";
import { ChevronLeft, ChevronRight, LayoutGrid, List, ArrowUp, ArrowDown } from "lucide-react";
import type { PostMeta, Level, PostType } from "@/types/post";

type ViewMode = "card" | "list";

// Sort Configuration
type SortKey = 'title' | 'date' | 'readingTime' | 'level' | 'author' | 'type';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

interface PostListClientProps {
    posts: PostMeta[];
    allTags: string[];
    allLevels: Level[];
}

const variants = {
    enter: (direction: number) => ({
        opacity: 0,
    }),
    center: {
        opacity: 1,
    },
    exit: (direction: number) => ({
        opacity: 0,
    }),
};

// Helper: Parse time string "5 min read" -> 5
const parseReadTime = (timeStr?: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

// Helper: Level weight
const getLevelWeight = (level?: Level): number => {
    switch (level) {
        case 'beginner': return 1;
        case 'intermediate': return 2;
        case 'advanced': return 3;
        default: return 0;
    }
};

export default function PostListClient({ posts, allTags, allLevels }: PostListClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedSort, setSelectedSort] = useState<string>("newest"); // Default sort

    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState(0);
    const [postsPerPage, setPostsPerPage] = useState(4);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("card");

    // Responsive posts per page and mobile detection
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 640;
            setIsMobile(mobile);

            if (viewMode === "list") {
                setPostsPerPage(10);
            } else if (mobile) { // < sm - mobile shows all posts
                setPostsPerPage(Infinity);
            } else { // All other card views (Tablet, Laptop, Desktop)
                setPostsPerPage(4);
            }
        };

        // Set initial value
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [viewMode]);

    // Sync URL -> State (Read params on mount/change)
    useEffect(() => {
        // Tags
        const tagsFromUrl = searchParams.get("tag");
        if (tagsFromUrl) {
            const tagArray = tagsFromUrl.split(",").map((t) => t.trim());
            const matchedTags = tagArray
                .map((tag) => allTags.find((t) => t.toLowerCase() === tag.toLowerCase()))
                .filter(Boolean) as string[];
            setSelectedTags(matchedTags);
        } else {
            setSelectedTags([]);
        }

        // Levels
        const levelsFromUrl = searchParams.get("level");
        if (levelsFromUrl) {
            const levelArray = levelsFromUrl.split(",").map((t) => t.trim());
            const matchedLevels = levelArray
                .map((level) => allLevels.find((l) => l.toLowerCase() === level.toLowerCase()))
                .filter(Boolean) as string[];
            setSelectedLevels(matchedLevels);
        } else {
            setSelectedLevels([]);
        }

        // Type
        const typeFromUrl = searchParams.get("type");
        if (typeFromUrl && ["standalone", "series"].includes(typeFromUrl)) {
            setSelectedType(typeFromUrl);
        } else {
            setSelectedType("");
        }

        // Sort
        const sortFromUrl = searchParams.get("sort");
        if (sortFromUrl && ["newest", "oldest", "a-z", "z-a", "easiest", "most-advanced"].includes(sortFromUrl)) {
            setSelectedSort(sortFromUrl);
        } else {
            setSelectedSort("newest");
        }

        // View Mode
        const viewFromUrl = searchParams.get("view");
        if (viewFromUrl && ["card", "list"].includes(viewFromUrl)) {
            setViewMode(viewFromUrl as ViewMode);
        } else {
            setViewMode("card");
        }
    }, [searchParams, allTags, allLevels]);

    // Helper to update URL based on current state + new changes
    const updateUrl = (newParams: Partial<{ tags: string[], levels: string[], type: string, sort: string, view: ViewMode }>) => {
        const t = newParams.tags !== undefined ? newParams.tags : selectedTags;
        const l = newParams.levels !== undefined ? newParams.levels : selectedLevels;
        const ty = newParams.type !== undefined ? newParams.type : selectedType;
        const s = newParams.sort !== undefined ? newParams.sort : selectedSort;
        const v = newParams.view !== undefined ? newParams.view : viewMode;

        const params = new URLSearchParams();
        if (t.length > 0) params.set("tag", t.join(","));
        if (l.length > 0) params.set("level", l.join(","));
        if (ty) params.set("type", ty);
        if (s !== "newest") params.set("sort", s);
        if (v !== "card") params.set("view", v);

        const query = params.toString();
        router.push(query ? `/post?${query}` : "/post", { scroll: false });
    };

    // Handlers
    const handleTagsChange = (values: string[]) => {
        const newTags = values.includes("") ? [] : values;
        setSelectedTags(newTags);
        updateUrl({ tags: newTags });
    };

    const handleLevelsChange = (values: string[]) => {
        const newLevels = values.includes("") ? [] : values;
        setSelectedLevels(newLevels);
        updateUrl({ levels: newLevels });
    };

    const handleTypeChange = (value: string) => {
        const newType = value === "" ? "" : value;
        setSelectedType(newType);
        updateUrl({ type: newType });
    };

    const handleSortChange = (value: string) => {
        const newSort = value === "" ? "newest" : value;
        setSelectedSort(newSort);
        updateUrl({ sort: newSort });
    };

    // Filter and sort posts
    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // Filters
        if (selectedTags.length > 0) {
            result = result.filter((post) =>
                post.tags?.some((t) =>
                    selectedTags.some((st) => t.toLowerCase() === st.toLowerCase())
                )
            );
        }
        if (selectedLevels.length > 0) {
            result = result.filter((post) =>
                post.level && selectedLevels.includes(post.level)
            );
        }
        if (selectedType) {
            result = result.filter((post) => {
                const postType = post.type || "standalone";
                return postType === selectedType;
            });
        }

        // Single Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (selectedSort) {
                case "newest": // Date Desc
                    return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
                case "oldest": // Date Asc
                    return new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
                case "a-z": // Title Asc
                    return a.title.localeCompare(b.title);
                case "z-a": // Title Desc
                    return b.title.localeCompare(a.title);
                case "easiest": // Level Asc (Beginner -> Advanced)
                    return getLevelWeight(a.level) - getLevelWeight(b.level);
                case "most-advanced": // Level Desc (Advanced -> Beginner)
                    return getLevelWeight(b.level) - getLevelWeight(a.level);
                default:
                    return 0;
            }
        });

        return result;
    }, [posts, selectedTags, selectedLevels, selectedType, selectedSort]);

    const clearFilters = () => {
        setSelectedTags([]);
        setSelectedLevels([]);
        setSelectedType("");
        setSelectedSort("newest");
        updateUrl({ tags: [], levels: [], type: "", sort: "newest" });
    };

    const hasActiveFilters = selectedTags.length > 0 || selectedLevels.length > 0 || selectedType !== "" || selectedSort !== "newest";

    // Options
    const tagOptions = [
        { value: "", label: "All" },
        ...allTags.map((tag) => ({ value: tag, label: tag }))
    ];

    const levelOptions = [
        { value: "", label: "All" },
        ...allLevels.map((level) => ({
            value: level,
            label: level.charAt(0).toUpperCase() + level.slice(1),
        }))
    ];

    const typeOptions = [
        { value: "", label: "All" },
        { value: "standalone", label: "Standalone" },
        { value: "series", label: "Series" },
    ];

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "a-z", label: "A-Z" },
        { value: "z-a", label: "Z-A" },
        { value: "easiest", label: "Easiest" },
        { value: "most-advanced", label: "Most Advanced" },
    ];

    const viewOptions = [
        { value: "card", label: "Card", icon: LayoutGrid },
        { value: "list", label: "List", icon: List },
    ];

    // Header Renderer (Static now)
    const renderHeader = (label: string) => {
        return (
            <div className="flex items-center gap-1 select-none text-(--foreground-dim)">
                <span>{label}</span>
            </div>
        );
    };

    return (
        <>
            {/* Filters & Sort Bar */}
            <div className="mt-6">
                <div className="grid grid-cols-[1fr_auto] sm:flex sm:flex-row sm:flex-wrap gap-4 items-start sm:items-center">
                    {/* Left side - Filters */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1">
                        {/* Filter by Tags */}
                        <div className="grid grid-cols-[3rem_1fr] sm:flex items-center gap-2">
                            <label className="text-xs text-(--foreground-dim) shrink-0">Tags:</label>
                            <MultiSelect
                                values={selectedTags}
                                onValuesChange={handleTagsChange}
                                options={tagOptions}
                                placeholder="All"
                                className="flex-1 cursor-pointer text-xs"
                                isActive={selectedTags.length > 0}
                            />
                        </div>

                        {/* Filter by Levels */}
                        <div className="grid grid-cols-[3rem_1fr] sm:flex items-center gap-2">
                            <label className="text-xs text-(--foreground-dim) shrink-0">Level:</label>
                            <MultiSelect
                                values={selectedLevels}
                                onValuesChange={handleLevelsChange}
                                options={levelOptions}
                                placeholder="All"
                                className="flex-1 cursor-pointer text-xs"
                                isActive={selectedLevels.length > 0}
                            />
                        </div>

                        {/* Filter by Type */}
                        <div className="grid grid-cols-[3rem_1fr] sm:flex items-center gap-2">
                            <label className="text-xs text-(--foreground-dim) shrink-0">Type:</label>
                            <Select
                                value={selectedType}
                                onValueChange={handleTypeChange}
                                options={typeOptions}
                                placeholder="All"
                                className="flex-1 cursor-pointer text-xs"
                                isActive={selectedType !== ""}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="grid grid-cols-[3rem_1fr] sm:flex items-center gap-2">
                            <label className="text-xs text-(--foreground-dim) shrink-0">Sort:</label>
                            <Select
                                value={selectedSort}
                                onValueChange={handleSortChange}
                                options={sortOptions}
                                placeholder="Newest"
                                className="flex-1 cursor-pointer text-xs"
                                isActive={selectedSort !== "newest"}
                            />
                        </div>

                        {/* Reset Filters */}
                        {hasActiveFilters && (
                            <Button
                                onClick={clearFilters}
                                variant="secondary"
                                className="mx-auto sm:mx-0"
                            >
                                Reset filters
                            </Button>
                        )}
                    </div>

                    {/* Right side - View Mode */}
                    <div className="flex items-center gap-2 ml-auto self-end">
                        <div className="flex items-center gap-1.5 text-xs text-(--foreground-dim)">
                            {viewMode === "card" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                        </div>
                        <Select
                            value={viewMode}
                            onValueChange={(v) => {
                                const newView = v as ViewMode;
                                setViewMode(newView);
                                updateUrl({ view: newView });
                            }}
                            options={viewOptions.map(o => ({ value: o.value, label: o.label }))}
                            placeholder="Card"
                            className="cursor-pointer text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Delimiter */}
            <div className="w-full border-t border-(--foreground-dim)/30 mt-2"></div>

            {/* Results count */}
            <p className="mt-2 mb-2 text-xs text-(--foreground-dim)">
                Showing {filteredPosts.length} of {posts.length} <span className="text-accent">{selectedType ? ` ${selectedType}` : ""}</span> posts
                {selectedTags.length > 0 && (
                    <> tagged &quot;<span className="text-accent">{selectedTags.join(", ")}</span>&quot;</>
                )}
                {selectedLevels.length > 0 && (
                    <> with level &quot;<span className="text-accent">{selectedLevels.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")}</span>&quot;</>
                )}
            </p>

            {/* No posts found */}
            {filteredPosts.length === 0 && (
                <p className="mt-10 text-foreground/50">No posts match your filters.</p>
            )}

            {/* Posts grid - mobile shows all posts as feed, desktop uses pagination */}
            <div className={`mt-4 relative overflow-hidden ${!isMobile ? 'min-h-[300px]' : ''}`}>
                {viewMode === "list" ? (
                    // List view (Desktop & Mobile with scroll)
                    <div className="flex flex-col gap-2 overflow-x-auto pb-2">
                        <div className="min-w-[1100px]">
                            {/* Header row */}
                            <div className="grid grid-cols-[4fr_3fr_90px_80px_95px_110px_100px] gap-4 px-4 py-2 text-xs font-semibold text-(--foreground-dim) border-b border-(--border-color) mb-4">
                                {renderHeader("Title")}
                                <span>Tags</span>
                                {renderHeader("Date")}
                                {renderHeader("Read")}
                                {renderHeader("Level")}
                                {renderHeader("Author")}
                                {renderHeader("Type")}
                            </div>
                            {/* List items */}
                            <AnimatePresence initial={false} mode="wait" custom={direction}>
                                <motion.div
                                    key={currentPage}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="flex flex-col gap-2"
                                >
                                    {filteredPosts
                                        .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                                        .map((post) => (
                                            <PostListItem
                                                key={post.slug}
                                                slug={post.slug}
                                                image={post.image}
                                                author={post.author}
                                                authorTitle={post.authorTitle}
                                                title={post.title}
                                                description={post.description}
                                                date={post.date}
                                                readingTime={post.readingTime}
                                                level={post.level}
                                                tags={post.tags}
                                                type={post.type}
                                                seriesOrder={post.seriesOrder}
                                                onClick={() => router.push(`/post/${post.slug}`)}
                                            />
                                        ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                ) : isMobile ? (
                    // Mobile: Show all posts as feed (Card mode)
                    <div className="flex flex-col gap-4">
                        {filteredPosts.map((post) => (
                            <PostCard
                                key={post.slug}
                                slug={post.slug}
                                image={post.image}
                                author={post.author}
                                authorTitle={post.authorTitle}
                                title={post.title}
                                description={post.description}
                                date={post.date}
                                readingTime={post.readingTime}
                                level={post.level}
                                tags={post.tags}
                                type={post.type}
                                seriesOrder={post.seriesOrder}
                                onClick={() => router.push(`/post/${post.slug}`)}
                            />
                        ))}
                    </div>
                ) : (
                    // Desktop/Tablet: Paginated card grid
                    <AnimatePresence initial={false} mode="wait" custom={direction}>
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            {filteredPosts
                                .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                                .map((post) => (
                                    <PostCard
                                        key={post.slug}
                                        slug={post.slug}
                                        image={post.image}
                                        author={post.author}
                                        authorTitle={post.authorTitle}
                                        title={post.title}
                                        description={post.description}
                                        date={post.date}
                                        readingTime={post.readingTime}
                                        level={post.level}
                                        tags={post.tags}
                                        type={post.type}
                                        seriesOrder={post.seriesOrder}
                                        onClick={() => router.push(`/post/${post.slug}`)}
                                    />
                                ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
                <div className="mt-2 flex items-center justify-center gap-4">
                    <button
                        onClick={() => {
                            setDirection(-1);
                            setCurrentPage((p) => Math.max(1, p - 1));
                        }}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-(--border-color) bg-background-hover hover:bg-accent/20 hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs text-(--foreground-dim)">
                        Page {currentPage} of {Math.ceil(filteredPosts.length / postsPerPage)}
                    </span>
                    <button
                        onClick={() => {
                            setDirection(1);
                            setCurrentPage((p) => Math.min(Math.ceil(filteredPosts.length / postsPerPage), p + 1));
                        }}
                        disabled={currentPage >= Math.ceil(filteredPosts.length / postsPerPage)}
                        className="p-2 rounded-md border border-(--border-color) bg-background-hover hover:bg-accent/20 hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </>
    );
}
