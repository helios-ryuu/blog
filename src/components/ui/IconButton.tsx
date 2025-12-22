"use client";

interface IconButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function IconButton({ children, onClick, className = "" }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`rounded-[7px] px-2 py-2 bg-background cursor-pointer hover:bg-background-hover transition-colors duration-200 [&>svg]:w-5 [&>svg]:h-5 ${className}`}
        >
            {children}
        </button>
    );
}

