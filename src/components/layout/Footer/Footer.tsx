"use client";

interface FooterProps {
    transparent?: boolean;
}

export default function Footer({ transparent = false }: FooterProps) {
    return (
        <footer className={`flex-none flex items-center justify-center h-12 ${transparent ? "bg-transparent" : "bg-background"}`}>
            <span className="text-sm text-(--foreground-dim)">
                © 2026 Helios
            </span>
        </footer>
    );
}
