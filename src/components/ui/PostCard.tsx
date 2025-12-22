"use client";

import Image from "next/image";
import FadeText from "./FadeText";

interface PostCardProps {
    image?: string;
    author?: string;
    authorTitle?: string;
    title: string;
    description: string;
    date?: string;
    readingTime?: string;
    tags?: string[];
    onClick?: () => void;
    className?: string;
}

export default function PostCard({
    image,
    author,
    authorTitle,
    title,
    description,
    date,
    readingTime,
    tags,
    onClick,
    className = ""
}: PostCardProps) {
    return (
        <div
            onClick={onClick}
            className={`flex flex-col h-135 w-90 rounded-[22px] border border-(--border-color) p-6 bg-(--post-card) cursor-pointer hover:border-(--border-color-hover) hover:bg-(--post-card-hover) active:border-accent transition-[border-color,background-color] duration-200 ${className}`}
        >
            {/* Top Section - floats to top */}
            <div className="flex-none">
                {/* Image */}
                {image && (
                    <div className="relative w-full h-70 rounded-[17px] overflow-hidden mb-4">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Author */}
                {author && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-foreground/50">
                        <FadeText text={author.toUpperCase() + (authorTitle ? " • " + authorTitle : "")} duration={200} isVisible={true} className="tracking-widest text-accent/90" />
                    </div>
                )}

                {/* Title */}
                {title && (
                    <h2 className="font-semibold text-[18px] tracking-wide line-clamp-2">{title}</h2>
                )}

                {/* Description */}
                {description && (
                    <p className="text-[12px] text-foreground/70 mt-1 line-clamp-3">{description}</p>
                )}
            </div>

            {/* Spacer - pushes bottom section down */}
            <div className="flex-1" />

            {/* Bottom Section - floats to bottom */}
            <div className="flex-none">
                {/* Delimiter */}
                <div className="w-full border-t border-(--border-color) mt-4 mb-4" />

                {/* Meta info */}
                {(date || readingTime) && (
                    <div className="flex items-center gap-2 text-xs text-foreground/50">
                        {date && <span>{date}</span>}
                        {date && readingTime && <span>•</span>}
                        {readingTime && <span>{readingTime}</span>}
                    </div>
                )}

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}