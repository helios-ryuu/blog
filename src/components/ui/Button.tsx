"use client";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "primary" | "secondary";
}

export default function Button({
    children,
    onClick,
    className = "",
    variant = "secondary"
}: ButtonProps) {
    const variants = {
        primary: "border-accent bg-accent/90 hover:border-accent-hover hover:bg-accent-hover",
        secondary: "border-accent/70 bg-accent/40 hover:border-accent-hover/80 hover:bg-accent-hover/60"
    };

    return (
        <button
            onClick={onClick}
            className={`rounded-[7px] border px-4 py-1 text-[14px] cursor-pointer transition-[background-color,border-color] duration-200 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
