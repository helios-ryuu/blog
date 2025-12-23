"use client";

import FadeText from "@/components/ui/FadeText";

export default function Footer() {
    return (
        <footer className="flex items-center justify-start h-12 bg-background transition-[background-color,border-color] duration-200">
            <FadeText
                text="© 2025 Helios"
                isVisible={true}
                duration={100}
                className="text-sm text-(--foreground-dim) ml-16"
            />
        </footer>
    );
}
