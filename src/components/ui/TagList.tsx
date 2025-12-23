"use client";

interface TagListProps {
    tags: string[];
    variant?: "compact" | "default";
    className?: string;
}

export default function TagList({ tags, variant = "default", className = "" }: TagListProps) {
    if (!tags || tags.length === 0) return null;

    const variants = {
        compact: "gap-1 mt-3",
        default: "gap-2 mt-4"
    };

    const tagStyles = {
        compact: "px-2 py-0.5 text-xs rounded",
        default: "px-3 py-1 text-sm rounded-[6px]"
    };

    return (
        <div className={`flex flex-wrap ${variants[variant]} ${className}`}>
            {tags.map((tag) => (
                <span
                    key={tag}
                    className={`bg-accent/20 text-accent ${tagStyles[variant]}`}
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}
