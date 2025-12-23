"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { PanelRightOpenIcon, PanelRightCloseIcon, X, Sun, Moon, ChevronRight, Slash } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";



interface HeaderProps {
    noBorder?: boolean;
    showMobileMenu?: boolean;
    banner?: {
        content: React.ReactNode;
        dismissible?: boolean;
    };
}

export default function Header({ noBorder = false, showMobileMenu = true, banner }: HeaderProps) {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [showBanner, setShowBanner] = useState(true);
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

    const dismissBanner = () => {
        setShowBanner(false);
    };

    return (
        <div className="sticky top-0 z-50">
            {/* Banner */}
            {banner && showBanner && (
                <div className="flex items-center justify-center bg-accent text-white/90 text-sm py-1.5 px-4">
                    <div className="flex-1 text-center">
                        {banner.content}
                    </div>
                    {banner.dismissible !== false && (
                        <button
                            onClick={dismissBanner}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {/* Header */}
            <header className={`flex h-14 items-center justify-start bg-background border-b transition-[background-color,border-color] duration-200 ${noBorder ? "border-transparent" : "border-(--border-color)"}`}>
                {/* Mobile menu button - only visible on mobile */}
                {showMobileMenu && (
                    <div className="md:hidden flex items-center justify-center h-full px-3">
                        <IconButton onClick={toggleMobileSidebar}>
                            {isMobileOpen ? <PanelRightOpenIcon strokeWidth={3} /> : <PanelRightCloseIcon strokeWidth={3} />}
                        </IconButton>
                    </div>
                )}

                {/* Logo & Breadcrumb */}
                <div className="flex flex-none items-center h-full w-auto text-accent">
                    <Image src="/favicon.ico" alt="Helios" width={24} height={24} className="w-6 h-6 md:ml-20 ml-4" />
                    <Link href="/" className="pl-4 pr-2 hover:text-accent-hover transition-colors">Helios</Link>
                    {(() => {
                        const pathname = usePathname();
                        const routes = [
                            { path: "/post", label: "Post" },
                            { path: "/journey", label: "Journey" },
                            { path: "/project", label: "Project" }
                        ];
                        const currentRoute = routes.find(r => pathname.startsWith(r.path));
                        if (currentRoute) {
                            return (
                                <>
                                    <Slash className="w-4 h-4 text-(--foreground-dim)" />
                                    <Link href={currentRoute.path} className="px-2 text-foreground hover:text-accent transition-colors">
                                        {currentRoute.label}
                                    </Link>
                                </>
                            );
                        }
                        return null;
                    })()}
                </div>

                {/* Right side */}
                <div className="flex flex-1 items-center justify-end h-full pr-4">
                    <button
                        onClick={() => {
                            const githubUrl = "https://github.com/helios-ryuu";
                            const githubAppUrl = "github://user?username=helios-ryuu";

                            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                            if (isMobile) {
                                window.location.href = githubAppUrl;
                                setTimeout(() => window.open(githubUrl, "_blank"), 100);
                            } else {
                                window.open(githubUrl, "_blank");
                            }
                        }}
                        className="p-2 rounded-[7px] cursor-pointer hover:bg-background-hover transition-colors duration-200 mr-10"
                    >
                        <Image
                            src={theme === "light" ? "/github-mark.svg" : "/github-mark-white.svg"}
                            alt="GitHub"
                            width={20}
                            height={20}
                        />
                    </button>
                    <IconButton onClick={toggleTheme} className={`text-(--foreground-dim) bg-background-hover ${theme === "light" ? "hover:text-blue-500" : "hover:text-yellow-500"}`}>
                        {theme === "light" ? <Moon strokeWidth={3} /> : <Sun strokeWidth={3} />}
                    </IconButton>
                </div>
            </header>
        </div>
    );
}
