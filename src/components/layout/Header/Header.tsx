"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import IconButton from "@/components/ui/IconButton";
import { Sun, Moon, Slash, SquareChevronDown, SquareChevronUp } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";
import MobileDropdown from "@/components/layout/MobileDropdown";

interface HeaderProps {
    noBorder?: boolean;
    showMobileMenu?: boolean;
}

export default function Header({ noBorder = false, showMobileMenu = true }: HeaderProps) {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const { isMobileOpen, setIsMobileOpen } = useSidebar();
    const pathname = usePathname();

    useEffect(() => {
        const html = document.documentElement;
        requestAnimationFrame(() => {
            if (theme === "light") {
                html.classList.add("light");
            } else {
                html.classList.remove("light");
            }
        });
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const routes = [
        { path: "/post", label: "Post" },
        { path: "/journey", label: "Journey" },
        { path: "/project", label: "Project" }
    ];
    const currentRoute = routes.find(r => pathname.startsWith(r.path));

    const openSocialLink = (appUrl: string, webUrl: string) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = appUrl;
            setTimeout(() => window.open(webUrl, "_blank"), 100);
        } else {
            window.open(webUrl, "_blank");
        }
    };

    return (
        <header className={`flex-none flex h-14 items-center bg-background border-b ${noBorder ? "border-transparent" : "border-(--border-color)"}`}>
            {/* Mobile menu button with dropdown */}
            {showMobileMenu && (
                <div className="md:hidden relative flex items-center justify-center h-full px-3">
                    <IconButton onClick={toggleMobileSidebar}>
                        {isMobileOpen ? <SquareChevronUp strokeWidth={3} /> : <SquareChevronDown strokeWidth={3} />}
                    </IconButton>
                    <MobileDropdown />
                </div>
            )}

            {/* Logo & Breadcrumb */}
            <div className="flex flex-none items-center h-full text-foreground">
                <Link href="/" className="md:ml-16 ml-4 mr-2">
                    <Image src="/favicon.ico" alt="Helios" width={24} height={24} className="w-6 h-6" />
                </Link>
                {currentRoute && (
                    <>
                        <Slash className="w-4 h-4 text-(--foreground-dim)" />
                        <Link href={currentRoute.path} className="px-2 text-foreground hover:text-accent transition-colors">
                            {currentRoute.label}
                        </Link>
                    </>
                )}
            </div>

            {/* Right side */}
            <div className="flex flex-1 items-center justify-end h-full pr-6 gap-1">
                <button
                    onClick={() => openSocialLink("linkedin://in/helios-nts", "https://www.linkedin.com/in/helios-nts/")}
                    className="p-2 rounded-md cursor-pointer hover:bg-background-hover"
                >
                    <Image
                        src={theme === "light" ? "/InBug-Black.png" : "/InBug-White.png"}
                        alt="LinkedIn"
                        width={20}
                        height={20}
                    />
                </button>
                <button
                    onClick={() => openSocialLink("github://user?username=helios-ryuu", "https://github.com/helios-ryuu")}
                    className="p-2 rounded-md cursor-pointer hover:bg-background-hover mr-6"
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
    );
}
