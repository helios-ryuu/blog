"use client";

import Image from "next/image";
import { FadeText, TagList } from "@/components/ui";
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
            className={`
                flex flex-col w-full h-122 min-h-108 p-4
                rounded-xl border border-(--border-color) bg-(--post-card)
                cursor-pointer
                hover:border-(--border-color-hover) hover:bg-(--post-card-hover)
                active:border-accent
                ${className}
            `}
        >
            {/* Top Section */}
            <div className="flex-none">
                {/* Image */}
                {image && (
                    <div className="relative w-full h-42 md:h-40 mb-6">
                        {/* Glow layer */}
                        <div className="absolute -inset-1 blur-lg opacity-16">
                            <Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw" className="object-cover rounded-xl" />
                        </div>
                        {/* Image container */}
                        <div className="relative w-full h-full rounded-xl overflow-hidden z-10">
                            <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw" className="object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-background/25 via-transparent to-transparent" />
                        </div>
                    </div>
                )}

                {/* Author */}
                {author && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-foreground/50">
                        <FadeText
                            text={author.toUpperCase() + (authorTitle ? " • " + authorTitle : "")}
                            duration={200}
                            isVisible={true}
                            className="tracking-widest text-accent/90"
                        />
                    </div>
                )}

                {/* Title */}
                {title && (
                    <h2 className="font-semibold text-lg tracking-wide line-clamp-2 leading-tight">{title}</h2>
                )}

                {/* Description */}
                {description && (
                    <p className="text-xs text-foreground/70 mt-2 line-clamp-3">{description}</p>
                )}

                {/* Tags */}
                {tags && (
                    <div className="mt-4">
                        <TagList
                            tags={tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))}
                            variant="compact"
                        />
                    </div>
                )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Section */}
            <div className="flex-none">
                <div className="w-full border-t border-(--border-color) mt-4 mb-3" />
                <StatColumns stats={[
                    ...(date ? [{ label: "Date", value: date }] : []),
                    ...(readingTime ? [{ label: "Read", value: readingTime }] : []),
                    ...(level ? [{
                        label: "Level",
                        value: (
                            <span className={`
                                ${level === 'beginner' ? 'bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-[4px]' : ''}
                                ${level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded-[4px]' : ''}
                                ${level === 'advanced' ? 'bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded-[4px]' : ''}
                            `}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </span>
                        )
                    }] : []),
                ]} />
            </div>
        </div>
    );
}
