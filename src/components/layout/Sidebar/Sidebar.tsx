"use client";

import { useState, useRef, useCallback } from "react";
import FadeText from "@/components/ui/FadeText";
import SidebarItem from "./SidebarItem";
import { HomeIcon, Newspaper, PanelRightCloseIcon, PanelRightOpenIcon, PlusIcon } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui";

export default function Sidebar() {
    const [hovered, setHovered] = useState(false);
    const { isPinned, setIsPinned, isMobileOpen, setIsMobileOpen } = useSidebar();
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

    const handleCloseMobile = () => {
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200 ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={handleCloseMobile}
            />

            {/* Sidebar */}
            <aside
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setHovered(false)}
                className={`
                    z-50 h-full flex flex-col items-stretch justify-start 
                    border-r border-(--border-color) bg-background overflow-hidden 
                    transition-all duration-200 ease-out
                    
                    ${/* Desktop styles */ ""}
                    ${isPinned ? "relative" : "absolute"} 
                    hidden md:flex
                    ${isExpanded ? "w-50" : "w-13"}
                    
                    ${/* Mobile styles - slide in/out animation */ ""}
                    max-md:fixed max-md:left-0 max-md:top-0 max-md:w-64 max-md:h-full max-md:flex
                    ${isMobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
                `}
            >
                {/* Desktop pin button */}
                <div className="hidden md:flex items-center justify-end">
                    <IconButton onClick={handleTogglePin} className="m-2">
                        {isPinned ? <PanelRightOpenIcon strokeWidth={2.5} /> : <PanelRightCloseIcon strokeWidth={2.5} />}
                    </IconButton>
                </div>

                {/* Mobile close button */}
                <div className="flex md:hidden items-center justify-end">
                    <IconButton onClick={handleCloseMobile} className="m-2">
                        <PanelRightOpenIcon strokeWidth={3} />
                    </IconButton>
                </div>

                <Button variant="primary" className={`flex items-center m-2 justify-center ${isExpanded || isMobileOpen ? "gap-x-1.5" : "gap-x-0"}`}>
                    <PlusIcon strokeWidth={3} className="w-5 h-5 shrink-0" />
                    <FadeText text="Post" isVisible={isExpanded || isMobileOpen} duration={100} className="font-semibold" />
                </Button>

                <SidebarItem
                    icon={<HomeIcon strokeWidth={2.5} />}
                    label={<FadeText text="Home" isVisible={isExpanded || isMobileOpen} duration={100} />}
                    href="/"
                    onClick={handleCloseMobile}
                />
                <SidebarItem
                    icon={<Newspaper strokeWidth={2.5} />}
                    label={<FadeText text="Posts" isVisible={isExpanded || isMobileOpen} duration={100} />}
                    className={isExpanded || isMobileOpen ? "gap-x-1.5" : "gap-x-0"}
                    href="/blog"
                    onClick={handleCloseMobile}
                />
            </aside>
        </>
    );
}
