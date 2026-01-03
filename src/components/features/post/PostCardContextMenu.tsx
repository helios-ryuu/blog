"use client";

import { useEffect, useRef } from "react";
import { Link2, QrCode } from "lucide-react";

interface PostCardContextMenuProps {
    x: number;
    y: number;
    postUrl: string;
    onClose: () => void;
    onShareQR: () => void;
    linkCopied: boolean;
    onCopyLink: () => void;
}

export default function PostCardContextMenu({
    x,
    y,
    postUrl,
    onClose,
    onShareQR,
    linkCopied,
    onCopyLink,
}: PostCardContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleScroll = () => onClose();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("scroll", handleScroll, true);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("scroll", handleScroll, true);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    // Adjust position to stay within viewport (Force Top-Left relative to cursor)
    const adjustedStyle = {
        left: `${Math.max(x, 170)}px`, // Ensure it doesn't go off-screen left
        top: `${Math.max(y, 90)}px`,   // Ensure it doesn't go off-screen top
        transform: 'translate(-100%, -100%)'
    };

    return (
        <div
            ref={menuRef}
            className="fixed z-100 min-w-[160px] p-1 rounded-lg border border-(--border-color) bg-background shadow-lg flex flex-col"
            style={adjustedStyle}
        >
            {/* Share as Link */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onCopyLink();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent/20 rounded-lg cursor-pointer transition-colors text-left"
            >
                <Link2 className="w-4 h-4" />
                <span className="whitespace-nowrap">{linkCopied ? "Link copied!" : "Share as Link"}</span>
            </button>

            {/* Share as QR Card */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onShareQR();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent/20 rounded-lg cursor-pointer transition-colors text-left"
            >
                <QrCode className="w-4 h-4" />
                <span className="whitespace-nowrap">Share as QR Card</span>
            </button>
        </div>
    );
}
