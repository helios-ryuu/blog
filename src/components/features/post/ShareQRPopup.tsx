"use client";

import { useRef, useEffect, useState } from "react";
import { Download, Copy, X, Check, Link as LinkIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import Image from "next/image";
import { FadeText, TagList } from "@/components/ui";
import StatColumns from "./StatColumns";
import type { Level, PostType } from "@/types/post";

interface ShareQRPopupProps {
    image?: string;
    author?: string;
    authorTitle?: string;
    title: string;
    description: string;
    date?: string;
    readingTime?: string;
    level?: Level;
    tags?: string[];
    type?: PostType;
    postUrl: string;
    onClose: () => void;
}

export default function ShareQRPopup({
    image,
    author,
    authorTitle,
    title,
    description,
    date,
    readingTime,
    level,
    tags,
    type,
    postUrl,
    onClose,
}: ShareQRPopupProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleDownload = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 2,
            });
            const link = document.createElement("a");
            link.download = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-share.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to generate image:", err);
        } finally {
            setDownloading(false);
        }
    };

    const handleCopyToClipboard = async () => {
        if (!cardRef.current || copied) return;
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 2,
            });
            const blob = await (await fetch(dataUrl)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy image:", err);
        }
    };

    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            onTouchMove={onClose}
        >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                    }}
                    disabled={downloading}
                    className="p-3 rounded-full bg-background/90 border border-(--border-color) hover:bg-accent/40 hover:border-accent cursor-pointer transition-colors disabled:opacity-50"
                    title="Download image"
                >
                    <Download className="w-5 h-5" strokeWidth={3} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCopyToClipboard();
                    }}
                    className="hidden sm:block p-3 rounded-full bg-background/90 border border-(--border-color) hover:bg-accent/40 hover:border-accent cursor-pointer transition-colors"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="w-5 h-5 text-green-500" strokeWidth={3} /> : <Copy className="w-5 h-5" strokeWidth={3} />}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="p-3 rounded-full bg-background/90 border border-(--border-color) hover:bg-red-500/40 hover:border-red-500 cursor-pointer transition-colors"
                    title="Close"
                >
                    <X className="w-5 h-5" strokeWidth={3} />
                </button>
            </div>

            {/* Card Preview */}
            <div
                ref={cardRef}
                onClick={(e) => e.stopPropagation()}
                className="w-86 p-4 rounded-xl border border-(--border-color) bg-(--post-card)"
            >
                {/* Image */}
                {image && (
                    <div className="relative w-full h-40 mb-4">
                        <div className="absolute -inset-1 blur-lg opacity-16">
                            <Image src={image} alt="" fill sizes="320px" className="object-cover rounded-xl" />
                        </div>
                        <div className="relative w-full h-full rounded-xl overflow-hidden z-10">
                            <Image src={image} alt={title} fill sizes="320px" className="object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-background/25 via-transparent to-transparent" />
                        </div>
                    </div>
                )}

                {/* Author */}
                {author && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-foreground/50">
                        <FadeText
                            text={author.toUpperCase() + (authorTitle ? " • " + authorTitle : "")}
                            duration={200}
                            isVisible={true}
                            className="tracking-widest text-accent/90"
                        />
                    </div>
                )}

                {/* Title */}
                {title && (
                    <h2 className="font-semibold text-lg tracking-wide line-clamp-2 leading-tight">{title}</h2>
                )}

                {/* Description */}
                {description && (
                    <p className="text-xs text-foreground/70 mt-1 line-clamp-4">{description}</p>
                )}

                {/* Tags */}
                {tags && (
                    <div className="mt-2">
                        <TagList tags={tags} variant="compact" />
                    </div>
                )}

                {/* QR Code Section */}
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-(--border-color)">
                    <div className="flex items-center ml-8 gap-2 text-xs text-foreground/60">
                        <LinkIcon className="w-3 h-3 text-accent/90" />
                        <span className="font-medium">Find out more:</span>
                    </div>
                    <div className="bg-[#fcfcfc] mr-12 p-1 rounded text-[#1a1a1a]">
                        <QRCodeSVG
                            value={postUrl}
                            size={56}
                            level="M"
                            bgColor="transparent"
                            fgColor="currentColor"
                        />
                    </div>
                </div>

                {/* Delimiter */}
                <div className="w-full border-t border-(--border-color) mt-2 mb-2" />

                {/* Stats */}
                <StatColumns stats={[
                    ...(date ? [{ label: "Date", value: date }] : []),
                    ...(readingTime ? [{ label: "Read", value: readingTime }] : []),
                    ...(level ? [{
                        label: "Level",
                        value: (
                            <span className={`
                                ${level === 'beginner' ? 'bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-[4px]' : ''}
                                ${level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded-[4px]' : ''}
                                ${level === 'advanced' ? 'bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded-[4px]' : ''}
                            `}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </span>
                        )
                    }] : []),
                ]} />

                {/* Series Badge */}
                {type === "series" && (
                    <div className="mt-2 w-full bg-accent/30 border rounded-[4px] border-accent/50 text-center">
                        <span className="text-xs font-bold tracking-widest text-accent-hover">
                            SERIES
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
