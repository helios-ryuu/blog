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
            className={`rounded-md p-2 cursor-pointer hover:bg-background-hover [&>svg]:size-5 ${className}`}
        >
            {children}
        </button>
    );
}
