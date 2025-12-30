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
import type { PostMeta, Level } from "@/types/post";

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
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState(0);
    const [postsPerPage, setPostsPerPage] = useState(4);

    // Responsive posts per page
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) { // < sm
                setPostsPerPage(1);
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

    // Read tags from URL params on mount and when params change
    useEffect(() => {
        const tagsFromUrl = searchParams.get("tag");
        if (tagsFromUrl) {
            // Support comma-separated tags
            const tagArray = tagsFromUrl.split(",").map((t) => t.trim());
            const matchedTags = tagArray
                .map((tag) => allTags.find((t) => t.toLowerCase() === tag.toLowerCase()))
                .filter(Boolean) as string[];
            if (matchedTags.length > 0) {
                setSelectedTags(matchedTags);
            }
        }
    }, [searchParams, allTags]);

    // Update URL when tag filter changes
    const handleTagsChange = (values: string[]) => {
        setSelectedTags(values);
        if (values.length > 0) {
            router.push(`/post?tag=${values.map(encodeURIComponent).join(",")}`, { scroll: false });
        } else {
            router.push("/post", { scroll: false });
        }
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
    }, [posts, selectedTags, selectedLevels, sortBy]);

    const clearFilters = () => {
        setSelectedTags([]);
        setSelectedLevels([]);
        setSortBy("newest");
        router.push("/post", { scroll: false });
    };

    const hasActiveFilters = selectedTags.length > 0 || selectedLevels.length > 0 || sortBy !== "newest";

    // Build options arrays
    const tagOptions = allTags.map((tag) => ({ value: tag, label: tag }));

    const levelOptions = allLevels.map((level) => ({
        value: level,
        label: level.charAt(0).toUpperCase() + level.slice(1),
    }));

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "a-z", label: "A-Z" },
        { value: "z-a", label: "Z-A" },
    ];

    return (
        <>
            {/* Filters & Sort Bar */}
            <div className="mt-8 md:mt-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
                {/* Filter by Tags */}
                <div className="grid grid-cols-[3rem_1fr] sm:flex items-center gap-2">
                    <label className="text-sm text-(--foreground-dim) shrink-0">Tags:</label>
                    <MultiSelect
                        values={selectedTags}
                        onValuesChange={handleTagsChange}
                        options={tagOptions}
                        placeholder="All"
                        className="flex-1 cursor-pointer"
                        isActive={selectedTags.length > 0}
                    />
                </div>

                {/* Filter by Levels */}
                <div className="grid grid-cols-[3rem_1fr] sm:flex items-center gap-2">
                    <label className="text-sm text-(--foreground-dim) shrink-0">Level:</label>
                    <MultiSelect
                        values={selectedLevels}
                        onValuesChange={setSelectedLevels}
                        options={levelOptions}
                        placeholder="All"
                        className="flex-1 cursor-pointer"
                        isActive={selectedLevels.length > 0}
                    />
                </div>

                {/* Sort */}
                <div className="grid grid-cols-[3rem_1fr] sm:flex items-center gap-2">
                    <label className="text-sm text-(--foreground-dim) shrink-0">Sort:</label>
                    <Select
                        value={sortBy}
                        onValueChange={(value) => setSortBy(value as SortOption)}
                        options={sortOptions}
                        placeholder="Newest"
                        className="flex-1 cursor-pointer"
                        isActive={sortBy !== "newest"}
                    />
                </div>

                {/* Reset Filters */}
                {hasActiveFilters && (
                    <Button
                        onClick={clearFilters}
                        variant="secondary"
                        className="mt-2 mx-auto sm:mx-0 sm:ml-10 sm:mt-0"
                    >
                        Reset filters
                    </Button>
                )}
            </div>

            {/* Results count */}
            <p className="mt-6 md:mt-4 text-sm text-(--foreground-dim)">
                Showing {filteredPosts.length} of {posts.length} posts
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

            {/* Posts grid - single row with max 4 */}
            <div className="mt-4 relative overflow-hidden min-h-[300px]">
                <AnimatePresence initial={false} mode="wait" custom={direction}>
                    <motion.div
                        key={currentPage}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    >
                        {filteredPosts
                            .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                            .map((post) => (
                                <PostCard
                                    key={post.slug}
                                    image={post.image}
                                    author={post.author}
                                    authorTitle={post.authorTitle}
                                    title={post.title}
                                    description={post.description}
                                    date={post.date}
                                    readingTime={post.readingTime}
                                    level={post.level}
                                    tags={post.tags}
                                    onClick={() => router.push(`/post/${post.slug}`)}
                                />
                            ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
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
                    <span className="text-sm text-(--foreground-dim)">
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
