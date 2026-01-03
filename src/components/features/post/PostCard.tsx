"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { FadeText, TagList } from "@/components/ui";
import StatColumns from "./StatColumns";
import PostCardContextMenu from "./PostCardContextMenu";
import ShareQRPopup from "./ShareQRPopup";
import type { Level, PostType } from "@/types/post";

interface PostCardProps {
    slug: string;
    image?: string;
    author?: string;
    authorTitle?: string;
    title: string;
    description: string;
    date?: string;
    readingTime?: string;
    level?: Level;
    tags?: string[];
    type?: PostType;
    onClick?: () => void;
    className?: string;
}

export default function PostCard({
    slug,
    image,
    author,
    authorTitle,
    title,
    description,
    date,
    readingTime,
    level,
    tags,
    type,
    onClick,
    className = ""
}: PostCardProps) {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [showQRPopup, setShowQRPopup] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const touchMoved = useRef(false);

    const postUrl = typeof window !== "undefined"
        ? `${window.location.origin}/post/${slug}`
        : `/post/${slug}`;

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchMoved.current = false;
        longPressTimer.current = setTimeout(() => {
            if (!touchMoved.current) {
                const touch = e.touches[0];
                setContextMenu({ x: touch.clientX, y: touch.clientY });
            }
        }, 500);
    }, []);

    const handleTouchMove = useCallback(() => {
        touchMoved.current = true;
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    }, []);

    const handleCloseMenu = useCallback(() => {
        setContextMenu(null);
        setLinkCopied(false);
    }, []);

    const handleCopyLink = useCallback(async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(postUrl);
            } else {
                // Fallback: create temporary textarea and copy
                const textarea = document.createElement('textarea');
                textarea.value = postUrl;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                textarea.style.top = '-9999px';
                textarea.style.opacity = '0';
                textarea.style.pointerEvents = 'none';
                textarea.style.fontSize = '16px'; // Prevent iOS zoom
                textarea.setAttribute('readonly', ''); // Prevent keyboard on iOS
                document.body.appendChild(textarea);
                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length); // For iOS
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            setLinkCopied(true);
            setTimeout(() => {
                setContextMenu(null);
                setLinkCopied(false);
            }, 1000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    }, [postUrl]);

    const handleOpenQRPopup = useCallback(() => {
        setContextMenu(null);
        setShowQRPopup(true);
    }, []);

    const handleClick = useCallback(() => {
        if (!contextMenu && onClick) {
            onClick();
        }
    }, [contextMenu, onClick]);

    return (
        <>
            <div
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`
                    relative flex flex-col w-full p-4
                    rounded-xl border border-(--border-color) bg-(--post-card)
                    cursor-pointer
                    hover:border-(--border-color-hover) hover:bg-(--post-card-hover)
                    active:border-accent
                    select-none
                    ${className}
                `}
            >
                {/* Top Section */}
                <div className="flex-none">
                    {/* Image */}
                    {image && (
                        <div className="relative w-full h-42 md:h-40 mb-4">
                            {/* Glow layer */}
                            <div className="absolute -inset-1 blur-xl opacity-16">
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
                        <p className="text-xs text-foreground/70 mt-1 line-clamp-5">{description}</p>
                    )}

                    {/* Tags */}
                    {tags && (
                        <div className="mt-2">
                            <TagList
                                tags={tags}
                                variant="compact"
                            />
                        </div>
                    )}

                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom Section */}
                <div className="flex-none">
                    <div className="w-full border-t border-(--border-color) mt-4 mb-2" />
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
                {/* Series Badge */}
                {type === "series" && (
                    <div className="mt-2 w-full bg-accent/30 border rounded-[4px] border-accent/50 text-center">
                        <span className="text-xs font-bold tracking-widest text-accent-hover">
                            SERIES
                        </span>
                    </div>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <PostCardContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    postUrl={postUrl}
                    onClose={handleCloseMenu}
                    onShareQR={handleOpenQRPopup}
                    linkCopied={linkCopied}
                    onCopyLink={handleCopyLink}
                />
            )}

            {/* QR Popup */}
            {showQRPopup && (
                <ShareQRPopup
                    image={image}
                    author={author}
                    authorTitle={authorTitle}
                    title={title}
                    description={description}
                    date={date}
                    readingTime={readingTime}
                    level={level}
                    tags={tags}
                    type={type}
                    postUrl={postUrl}
                    onClose={() => setShowQRPopup(false)}
                />
            )}
        </>
    );
}
