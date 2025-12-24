"use client";

import { useState, useRef, useCallback } from "react";
import FadeText from "@/components/ui/FadeText";
import SidebarItem from "./SidebarItem";
import { CompassIcon, FlameIcon, HomeIcon, Menu, NewspaperIcon, PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Sidebar() {
    const [hovered, setHovered] = useState(false);
    const { isPinned, setIsPinned } = useSidebar();
    const hoverCooldownRef = useRef(false);

    const isExpanded = isPinned || hovered;

    const handleMouseEnter = useCallback(() => {
        if (!hoverCooldownRef.current) {
            setHovered(true);
        }
    }, []);

    const handleTogglePin = useCallback(() => {
        if (isPinned) {
            hoverCooldownRef.current = true;
            setHovered(false);
            setIsPinned(false);
            setTimeout(() => {
                hoverCooldownRef.current = false;
            }, 300);
        } else {
            setIsPinned(true);
        }
    }, [isPinned, setIsPinned]);

    return (
        <aside
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setHovered(false)}
            className={`
                hidden md:flex flex-col
                z-50 h-full border-r border-(--border-color) bg-background overflow-hidden
                ${isPinned ? "relative" : "absolute"} 
                ${isExpanded ? "w-48" : "w-13"}
            `}
        >
            {/* Menu title */}
            <div className="flex items-center h-10 relative">
                <div className={`absolute m-2 transition-[opacity,left] duration-200 ${isExpanded ? "opacity-0 left-full" : "opacity-100 left-2"}`}>
                    <Menu strokeWidth={2.5} className="w-5 h-5 text-foreground/50" />
                </div>
                <FadeText text="Menu" isVisible={isExpanded} duration={100} className="ml-4 font-medium" />
            </div>

            {/* Divider */}
            <div className="border-t border-(--border-color) mb-2 mx-3" />

            <SidebarItem
                icon={<HomeIcon strokeWidth={2.5} />}
                label={<FadeText text="Home" isVisible={isExpanded} duration={100} />}
                href="/"
            />
            <SidebarItem
                icon={<NewspaperIcon strokeWidth={2.5} />}
                label={<FadeText text="Posts" isVisible={isExpanded} duration={100} />}
                className={isExpanded ? "gap-x-1.5" : "gap-x-0"}
                href="/post"
            />
            <SidebarItem
                icon={<CompassIcon strokeWidth={2.5} />}
                label={<FadeText text="Journeys" isVisible={isExpanded} duration={100} />}
                className={isExpanded ? "gap-x-1.5" : "gap-x-0"}
                href="/journey"
            />
            <SidebarItem
                icon={<FlameIcon strokeWidth={2.5} />}
                label={<FadeText text="Projects" isVisible={isExpanded} duration={100} />}
                className={isExpanded ? "gap-x-1.5" : "gap-x-0"}
                href="/project"
            />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Divider */}
            <div className="border-t border-(--border-color) mx-3" />

            {/* Pin button */}
            <div className="flex items-center justify-end">
                <IconButton onClick={handleTogglePin} className={`m-2 ${isPinned ? "text-accent bg-accent/20" : "text-(--foreground-dim) bg-background"}`}>
                    {isPinned ? <PanelRightOpenIcon strokeWidth={2.5} /> : <PanelRightCloseIcon strokeWidth={2.5} />}
                </IconButton>
            </div>
        </aside>
    );
}
