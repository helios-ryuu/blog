"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui";

interface BannerProps {
    content: React.ReactNode;
    dismissible?: boolean;
}

export default function Banner({ content, dismissible = true }: BannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="flex items-center justify-center bg-accent text-white/90 text-sm py-1.5 px-4">
            <div className="flex-1 text-center">
                {content}
            </div>
            {dismissible && (
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
