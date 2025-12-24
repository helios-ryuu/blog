"use client";

import { useEffect, useState } from "react";

interface FadeTextProps {
    text: string;
    isVisible: boolean;
    duration?: number;
    className?: string;
}

export default function FadeText({ text, isVisible, duration = 200, className = "" }: FadeTextProps) {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const intervalTime = duration / text.length;

        if (isVisible) {
            let i = visibleCount;
            const timer = setInterval(() => {
                i++;
                setVisibleCount(i);
                if (i >= text.length) clearInterval(timer);
            }, intervalTime);
            return () => clearInterval(timer);
        } else {
            let i = visibleCount;
            const timer = setInterval(() => {
                i--;
                setVisibleCount(i);
                if (i <= 0) clearInterval(timer);
            }, intervalTime);
            return () => clearInterval(timer);
        }
    }, [isVisible, duration, text.length]);

    return (
        <span
            className={`whitespace-nowrap text-sm overflow-hidden ${className}`}
            style={{ width: visibleCount > 0 ? 'auto' : 0 }}
        >
            {text.split("").map((char, index) => (
                <span
                    key={index}
                    style={{ opacity: index < visibleCount ? 1 : 0, transition: 'opacity 0.2s' }}
                >
                    {char}
                </span>
            ))}
        </span>
    );
}
