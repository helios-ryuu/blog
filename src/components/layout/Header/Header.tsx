"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { PanelRightOpenIcon, PanelRightCloseIcon } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Header() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const { isMobileOpen, setIsMobileOpen } = useSidebar();

    useEffect(() => {
        const html = document.documentElement;
        if (theme === "light") {
            html.classList.add("light");
        } else {
            html.classList.remove("light");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <header className="flex h-14 items-center justify-start border-b border-(--border-color)">
            {/* Mobile menu button - only visible on mobile */}
            <div className="md:hidden flex items-center justify-center h-full px-3">
                <IconButton onClick={toggleMobileSidebar}>
                    {isMobileOpen ? <PanelRightOpenIcon strokeWidth={3} /> : <PanelRightCloseIcon strokeWidth={3} />}
                </IconButton>
            </div>

            {/* Logo */}
            <div className="flex flex-none items-center justify-center h-full w-30 text-accent">
                <Link href="/">Helios</Link>
            </div>

            {/* Right side */}
            <div className="flex flex-1 items-center justify-end h-full">
                <Button onClick={toggleTheme} className="m-6">
                    {theme === "light" ? "Dark" : "Light"}
                </Button>
            </div>
        </header>
    );
}
