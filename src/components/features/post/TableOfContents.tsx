"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const isClickNavigating = useRef(false);

    useEffect(() => {
        // Extract headings from markdown content
        const headingRegex = /^(#{2,3})\s+(.+)$/gm;
        const matches: TocItem[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            matches.push({ id, text, level });
        }

        setHeadings(matches);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Only update from scroll if not currently navigating via click
                if (isClickNavigating.current) return;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0% -80% 0%" }
        );

        // Observe all headings
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();

        // Set active immediately on click
        setActiveId(id);
        isClickNavigating.current = true;

        // Scroll to element
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }

        // Re-enable scroll detection after scroll animation completes
        setTimeout(() => {
            isClickNavigating.current = false;
        }, 800);
    }, []);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-14">
            <h4 className="text-sm font-semibold text-foreground/70 mb-3 uppercase tracking-wider">
                On this page
            </h4>
            <ul className="space-y-2">
                {headings.map(({ id, text, level }) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            onClick={(e) => handleClick(e, id)}
                            className={`
                                block text-sm py-1 border-l-2 transition-colors
                                ${level === 3 ? "pl-6" : "pl-2"}
                                ${activeId === id
                                    ? "border-accent text-accent"
                                    : "border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/30"
                                }
                            `}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
