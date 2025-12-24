"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
    icon?: React.ReactNode;
    label: React.ReactNode;
    href: string;
    className?: string;
    onClick?: () => void;
}

export default function SidebarItem({ icon, label, href, className = "", onClick }: SidebarItemProps) {
    const pathname = usePathname();
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                flex items-center gap-x-2 pl-2 py-1 mt-0.5 mx-2 rounded-md
                ${isActive
                    ? "bg-accent/20 text-accent"
                    : "text-(--foreground-dim) hover:text-foreground hover:bg-foreground/5"
                }
                ${className}
            `}
        >
            {icon && <span className="flex-none size-5 flex items-center justify-center [&>svg]:size-5">{icon}</span>}
            <span className="whitespace-nowrap">{label}</span>
        </Link>
    );
}
