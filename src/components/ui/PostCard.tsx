"use client";

import Image from "next/image";
import FadeText from "./FadeText";
import TagList from "./TagList";
import StatColumns from "./StatColumns";
import type { Level } from "@/types/post";

interface PostCardProps {
    image?: string;
    author?: string;
    authorTitle?: string;
    title: string;
    description: string;
    date?: string;
    readingTime?: string;
    level?: Level;
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
    level,
    tags,
    onClick,
    className = ""
}: PostCardProps) {
    return (
        <div
            onClick={onClick}
            className={`flex flex-col h-150 w-95 rounded-[22px] border border-(--border-color) p-5 bg-(--post-card) cursor-pointer hover:border-(--border-color-hover) hover:bg-(--post-card-hover) active:border-accent transition-[border-color,background-color] duration-200 ${className}`}
        >
            {/* Top Section - floats to top */}
            <div className="flex-none">
                {/* Image */}
                {image && (
                    <div className="relative w-full h-70 mb-6">
                        {/* Glow layer - blurred duplicate behind (outside overflow-hidden) */}
                        <div className="absolute -inset-1 blur-xl opacity-16">
                            <Image
                                src={image}
                                alt=""
                                fill
                                className="object-cover rounded-[17px]"
                            />
                        </div>

                        {/* Image container with overflow-hidden */}
                        <div className="relative w-full h-full rounded-[17px] overflow-hidden z-10">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                            {/* Color overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-background/32 via-transparent to-transparent" />
                        </div>
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
                    <h2 className="font-semibold text-[18px] tracking-wide line-clamp-2 leading-tight">{title}</h2>
                )}

                {/* Description */}
                {description && (
                    <p className="text-[12px] text-foreground/70 mt-2 line-clamp-4">{description}</p>
                )}

                {/* Tags */}
                {tags && (
                    <div className="mt-4">
                        <TagList tags={tags} variant="compact" />
                    </div>
                )}
            </div>

            {/* Spacer - pushes bottom section down */}
            <div className="flex-1" />

            {/* Bottom Section - floats to bottom */}
            <div className="flex-none">
                {/* Delimiter */}
                <div className="w-full border-t border-(--border-color) mt-4 mb-3 transition-[border-color] duration-200" />

                {/* Stats - includes meta info */}
                <StatColumns stats={[
                    ...(date ? [{ label: "Date", value: date }] : []),
                    ...(readingTime ? [{ label: "Read", value: readingTime }] : []),
                    ...(level ? [{ label: "Level", value: level.charAt(0).toUpperCase() + level.slice(1) }] : []),
                ]} />
            </div>
        </div>
    );
}