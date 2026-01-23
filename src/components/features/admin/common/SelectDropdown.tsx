"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectDropdownProps {
    options: SelectOption[];
    value?: string;
    placeholder?: string;
    className?: string;
    onChange?: (value: string) => void;
}

export function SelectDropdown({ 
    options, 
    value = "", 
    placeholder = "Select...", 
    className = "",
    onChange 
}: SelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => String(opt.value) === value);
    const displayText = selectedOption?.label || placeholder;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleSelect = (optValue: string | number) => {
        onChange?.(String(optValue));
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-2 pr-10 rounded-md border border-(--border-color) bg-background text-sm text-left flex items-center justify-between cursor-pointer ${
                    value ? "text-foreground" : "text-foreground/60"
                }`}
            >
                <span className="truncate">{displayText}</span>
                <ChevronDown
                    size={16}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 p-1 rounded-md border border-(--border-color) bg-background shadow-lg max-h-[210px] overflow-auto">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelect(opt.value)}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors text-left ${
                                String(opt.value) === value
                                    ? "bg-accent/20 text-accent"
                                    : "text-foreground hover:bg-accent/20"
                            }`}
                        >
                            <span className="truncate">{opt.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
