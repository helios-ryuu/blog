"use client";

import { useState, useRef, useCallback } from "react";
import FadeText from "@/components/ui/FadeText";
import SidebarItem from "./SidebarItem";
import { Menu, PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { useSidebar } from "@/contexts/SidebarContext";
import { menuItems } from "@/config/navigation";

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
                ${isExpanded ? "w-38" : "w-10"}
            `}
        >
            {/* Menu title */}
            <div className="flex items-center p-2 relative">
                <div className={`absolute m-1 transition-[opacity,left] duration-200 ${isExpanded ? "opacity-0 left-full" : "opacity-100 left-2"}`}>
                    <Menu strokeWidth={3} className="w-4 h-4 text-foreground/50" />
                </div>
                <FadeText text="Menu" isVisible={isExpanded} duration={100} className="ml-4 font-medium text-xs text-foreground/50" />
            </div>

            {/* Divider */}
            <div className="border-t border-(--border-color) mb-1 mx-1.5" />

            {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <SidebarItem
                        key={item.href}
                        icon={<Icon strokeWidth={3} />}
                        label={<FadeText text={item.label} isVisible={isExpanded} duration={100} />}
                        className={isExpanded ? "gap-x-1.5" : "gap-x-0"}
                        href={item.href}
                    />
                );
            })}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Divider */}
            <div className="border-t border-(--border-color) mx-1.5" />

            {/* Pin button */}
            <div className="flex items-center justify-end">
                <IconButton onClick={handleTogglePin} className={`m-1 ${isPinned ? "text-accent bg-accent/20" : "text-(--foreground-dim) bg-background"}`}>
                    {isPinned ? <PanelRightOpenIcon strokeWidth={3} /> : <PanelRightCloseIcon strokeWidth={2.5} />}
                </IconButton>
            </div>
        </aside>
    );
}
