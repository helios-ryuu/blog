"use client";

import { useState, useCallback } from "react";
import { Share2 } from "lucide-react";
import PostCardContextMenu from "./PostCardContextMenu";
import ShareQRPopup from "./ShareQRPopup";
import type { Post } from "@/types/post";

interface PostShareActionsProps {
    post: Post;
}

export default function PostShareActions({ post }: PostShareActionsProps) {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [showQRPopup, setShowQRPopup] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const postUrl = typeof window !== "undefined"
        ? `${window.location.origin}/post/${post.slug}`
        : `/post/${post.slug}`;

    const handleShareClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
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

    return (
        <div className="mt-6 flex justify-center">
            <button
                onClick={handleShareClick}
                className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors
                    ${contextMenu
                        ? "text-foreground bg-accent/20 border border-accent-hover/60"
                        : "text-foreground/70 border border-background-hover/70 bg-background-hover/30 hover:text-foreground hover:bg-accent/10 hover:border-accent/20"
                    }
                `}
            >
                <Share2 className="w-4 h-4" />
                Share this post
            </button>

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
                    postUrl={postUrl}
                    onClose={() => setShowQRPopup(false)}
                />
            )}
        </div>
    );
}
