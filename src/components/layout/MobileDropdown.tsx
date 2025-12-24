"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompassIcon, FlameIcon, HomeIcon, NewspaperIcon } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

const menuItems = [
    { icon: <HomeIcon strokeWidth={2.5} />, label: "Home", href: "/" },
    { icon: <NewspaperIcon strokeWidth={2.5} />, label: "Posts", href: "/post" },
    { icon: <CompassIcon strokeWidth={2.5} />, label: "Journeys", href: "/journey" },
    { icon: <FlameIcon strokeWidth={2.5} />, label: "Projects", href: "/project" },
];

export default function MobileDropdown() {
    const { isMobileOpen, setIsMobileOpen } = useSidebar();
    const pathname = usePathname();

    const handleClose = () => setIsMobileOpen(false);

    return (
        <>
            {/* Dim overlay */}
            <div
                className={`fixed inset-0 z-40 ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={handleClose}
            />

            {/* Dropdown menu */}
            <div
                className={`
                    absolute top-full left-0 z-50
                    min-w-48 mt-1 bg-background border border-(--border-color) rounded-lg
                    shadow-lg overflow-hidden origin-top-left
                    ${isMobileOpen
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-0 pointer-events-none"
                    }
                `}
            >
                <nav className="flex flex-col py-1">
                    {menuItems.map((item) => {
                        const isActive = item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleClose}
                                className={`
                                    flex items-center gap-3 px-4 py-2.5
                                    ${isActive
                                        ? "bg-accent/15 text-accent"
                                        : "text-foreground hover:bg-foreground/5"
                                    }
                                `}
                            >
                                <span className="size-5 [&>svg]:size-5">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
