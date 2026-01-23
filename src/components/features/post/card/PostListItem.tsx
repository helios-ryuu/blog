"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TagList } from "@/components/ui";
import PostCardContextMenu from "./PostCardContextMenu";
import ShareQRPopup from "../share/ShareQRPopup";
import type { Level, PostType } from "@/types/post";

interface PostListItemProps {
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
    seriesOrder?: number;
    onClick?: () => void;
    className?: string;
}

export default function PostListItem({
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
    seriesOrder,
    onClick,
    className = ""
}: PostListItemProps) {
    const router = useRouter();
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
                const textarea = document.createElement('textarea');
                textarea.value = postUrl;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                textarea.style.top = '-9999px';
                textarea.style.opacity = '0';
                textarea.style.pointerEvents = 'none';
                textarea.style.fontSize = '16px';
                textarea.setAttribute('readonly', '');
                document.body.appendChild(textarea);
                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length);
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

    const handleDownloadMarkdown = useCallback(() => {
        const downloadUrl = `/api/post/${slug}/download?format=md`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${slug}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setContextMenu(null);
    }, [slug]);



    const handleClick = useCallback(() => {
        if (!contextMenu) {
            if (onClick) {
                onClick();
            } else {
                router.push(`/post/${slug}`);
            }
        }
    }, [contextMenu, onClick, router, slug]);

    return (
        <>
            <div
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`
                    grid grid-cols-[4fr_3fr_90px_80px_95px_110px_100px] gap-4 px-4 py-2 
                    rounded-xl border border-(--border-color) bg-(--post-card) 
                    hover:border-(--border-color-hover) hover:bg-(--post-card-hover) 
                    cursor-pointer transition-colors items-center select-none
                    ${className}
                `}
            >
                <span className="text-sm font-medium truncate">{title}</span>
                <div onClick={(e) => e.stopPropagation()}>
                    <TagList tags={tags || []} variant="compact" className="mt-0" />
                </div>
                <span className="text-xs text-(--foreground-dim)">{date}</span>
                <span className="text-xs text-(--foreground-dim) whitespace-nowrap">{readingTime}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-sm w-fit ${level === 'beginner' ? 'bg-green-500/20 text-green-500' :
                    level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-500' :
                        level === 'advanced' ? 'bg-red-500/20 text-red-500' : ''
                    }`}>
                    {level ? level.charAt(0).toUpperCase() + level.slice(1) : '-'}
                </span>
                <span className="text-xs text-accent/90 truncate">{author || '-'}</span>

                {/* Type Badge */}
                {type === 'series' ? (
                    <div className="flex items-center justify-center bg-accent/30 border rounded-md border-accent/50 w-full max-w-[100px]">
                        <span className="text-[10px] font-bold tracking-wider text-accent-hover px-1.5 py-0.5 border-r border-accent/50">SERIES</span>
                        <span className="text-[10px] font-bold text-accent-hover px-1.5 py-0.5 flex-1 text-center">{seriesOrder ?? "?"}</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center bg-blue-500/20 border rounded-md border-blue-500/40 w-full max-w-[100px]">
                        <span className="text-[10px] font-bold tracking-wider text-blue-500 px-1.5 py-0.5">STANDALONE</span>
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
                    onDownloadMarkdown={handleDownloadMarkdown}
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
                    seriesOrder={seriesOrder}
                    postUrl={postUrl}
                    onClose={() => setShowQRPopup(false)}
                />
            )}
        </>
    );
}
