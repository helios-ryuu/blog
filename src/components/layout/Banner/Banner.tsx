"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface BannerProps {
    content: React.ReactNode;
    dismissible?: boolean;
    id?: string; // Unique ID for localStorage key
    cooldownMinutes?: number; // Minutes before banner can show again
    gradient?: string; // CSS gradient string, e.g. "linear-gradient(to right, #ff6b6b, #feca57)"
    bgColor?: string; // Fallback solid color
}

const BANNER_STORAGE_PREFIX = "banner_dismissed_";

export default function Banner({
    content,
    dismissible = true,
    id = "default",
    cooldownMinutes = 5,
    gradient,
    bgColor = "#ef4444"
}: BannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const storageKey = BANNER_STORAGE_PREFIX + id;
        const dismissedAt = localStorage.getItem(storageKey);

        if (dismissedAt) {
            const dismissedTime = parseInt(dismissedAt, 10);
            const now = Date.now();
            const cooldownMs = cooldownMinutes * 60 * 1000;

            // Show banner if cooldown has passed
            if (now - dismissedTime >= cooldownMs) {
                localStorage.removeItem(storageKey);
                setIsVisible(true);
            }
            // Otherwise keep hidden
        } else {
            // Never dismissed, show banner
            setIsVisible(true);
        }
    }, [id, cooldownMinutes]);

    const handleDismiss = () => {
        const storageKey = BANNER_STORAGE_PREFIX + id;
        localStorage.setItem(storageKey, Date.now().toString());
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className="flex items-center justify-center text-white/90 text-sm py-1 px-4"
            style={{ background: gradient || bgColor }}
        >
            <div className="flex-1 text-center">
                {content}
            </div>
            {dismissible && (
                <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
