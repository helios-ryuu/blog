"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PostCard } from "@/components/features/post";
import Select from "@/components/ui/Select";
import MultiSelect from "@/components/ui/MultiSelect";
import { Button } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PostMeta, Level, PostType } from "@/types/post";

type SortOption = "newest" | "oldest" | "a-z" | "z-a";

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

export default function PostListClient({ posts, allTags, allLevels }: PostListClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState(0);
    const [postsPerPage, setPostsPerPage] = useState(4);
    const [isMobile, setIsMobile] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Responsive posts per page and mobile detection
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 640;
            setIsMobile(mobile);

            if (mobile) { // < sm - mobile shows all posts
                setPostsPerPage(Infinity);
            } else if (width < 768) { // sm
                setPostsPerPage(2);
            } else if (width < 1280) { // md & lg < 1280
                setPostsPerPage(3);
            } else { // xl and above
                setPostsPerPage(4);
            }
        };

        // Set initial value
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
        if (sortFromUrl && ["newest", "oldest", "a-z", "z-a"].includes(sortFromUrl)) {
            setSortBy(sortFromUrl as SortOption);
        } else {
            setSortBy("newest");
        }

        // Auto-show filters if any filter is active from URL
        if (tagsFromUrl || levelsFromUrl || typeFromUrl || (sortFromUrl && sortFromUrl !== "newest")) {
            setShowFilters(true);
        }
    }, [searchParams, allTags, allLevels]);

    // Helper to update URL based on current state + new changes
    const updateUrl = (newParams: Partial<{ tags: string[], levels: string[], type: string, sort: SortOption }>) => {
        const t = newParams.tags !== undefined ? newParams.tags : selectedTags;
        const l = newParams.levels !== undefined ? newParams.levels : selectedLevels;
        const ty = newParams.type !== undefined ? newParams.type : selectedType;
        const s = newParams.sort !== undefined ? newParams.sort : sortBy;

        const params = new URLSearchParams();
        if (t.length > 0) params.set("tag", t.join(","));
        if (l.length > 0) params.set("level", l.join(","));
        if (ty) params.set("type", ty);
        if (s !== "newest") params.set("sort", s);

        const query = params.toString();
        router.push(query ? `/post?${query}` : "/post", { scroll: false });
    };

    // Update URL when tag filter changes
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
        // If "All" is selected (empty string)
        const newType = value === "" ? "" : value;
        setSelectedType(newType);
        updateUrl({ type: newType });
    };

    const handleSortChange = (value: string) => {
        const newSort = value as SortOption;
        setSortBy(newSort);
        updateUrl({ sort: newSort });
    };

    // Filter and sort posts
    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // Filter by tags (post must have at least one of the selected tags)
        if (selectedTags.length > 0) {
            result = result.filter((post) =>
                post.tags?.some((t) =>
                    selectedTags.some((st) => t.toLowerCase() === st.toLowerCase())
                )
            );
        }

        // Filter by levels (post must have one of the selected levels)
        if (selectedLevels.length > 0) {
            result = result.filter((post) =>
                post.level && selectedLevels.includes(post.level)
            );
        }

        // Filter by type
        if (selectedType) {
            result = result.filter((post) => {
                const postType = post.type || "standalone";
                return postType === selectedType;
            });
        }

        // Sort
        switch (sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
            case "a-z":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "z-a":
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        return result;
    }, [posts, selectedTags, selectedLevels, selectedType, sortBy]);

    const clearFilters = () => {
        setSelectedTags([]);
        setSelectedLevels([]);
        setSelectedType("");
        setSortBy("newest");
        updateUrl({ tags: [], levels: [], type: "", sort: "newest" });
    };

    const hasActiveFilters = selectedTags.length > 0 || selectedLevels.length > 0 || selectedType !== "" || sortBy !== "newest";

    // Build options arrays
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

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "a-z", label: "A-Z" },
        { value: "z-a", label: "Z-A" },
    ];

    const typeOptions = [
        { value: "", label: "All" },
        { value: "standalone", label: "Standalone" },
        { value: "series", label: "Series" },
    ];

    return (
        <>
            {/* Filters & Sort Bar */}
            <div className="mt-6">
                {!showFilters ? (
                    <Button onClick={() => setShowFilters(true)}>
                        Filter Posts
                    </Button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row flex-wrap gap-4"
                    >
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

                        {/* Sort */}
                        <div className="grid grid-cols-[3rem_1fr] sm:flex items-center gap-2">
                            <label className="text-xs text-(--foreground-dim) shrink-0">Sort:</label>
                            <Select
                                value={sortBy}
                                onValueChange={handleSortChange}
                                options={sortOptions}
                                placeholder="Newest"
                                className="flex-1 cursor-pointer text-xs"
                                isActive={sortBy !== "newest"}
                            />
                        </div>

                        {/* Reset Filters */}
                        {hasActiveFilters && (
                            <Button
                                onClick={clearFilters}
                                variant="secondary"
                                className="mx-auto sm:mx-0 sm:ml-8"
                            >
                                Reset filters
                            </Button>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Results count */}
            <p className="mt-6 md:mt-4 text-xs text-(--foreground-dim)">
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
                {isMobile ? (
                    // Mobile: Show all posts as feed
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
                                onClick={() => router.push(`/post/${post.slug}`)}
                            />
                        ))}
                    </div>
                ) : (
                    // Desktop/Tablet: Paginated grid
                    <AnimatePresence initial={false} mode="wait" custom={direction}>
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
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
                                        onClick={() => router.push(`/post/${post.slug}`)}
                                    />
                                ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination - hidden on mobile */}
            {!isMobile && filteredPosts.length > postsPerPage && (
                <div className="mt-8 flex items-center justify-center gap-4">
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
