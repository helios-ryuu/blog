"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, Trash2, Copy, Check, Image, File, RefreshCw, ExternalLink, Pencil, X } from "lucide-react";
import { Button } from "../common/Button";
import { useToast } from "../common/Toast";

interface BucketFile {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    publicUrl: string;
    metadata?: {
        size: number;
        mimetype: string;
    };
}

export default function BucketManager() {
    const { showToast } = useToast();
    const [files, setFiles] = useState<BucketFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<BucketFile | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [renameFile, setRenameFile] = useState<{ name: string; newName: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = useCallback(async (refresh = false) => {
        setIsLoading(true);
        try {
            const url = refresh ? "/api/admin/bucket?refresh=true" : "/api/admin/bucket";
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setFiles(data.data);
            } else {
                showToast("error", data.message || "Failed to load files");
            }
        } catch {
            showToast("error", "Failed to load files");
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleRefresh = () => {
        fetchFiles(true);
        showToast("info", "Refreshing files...");
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setIsUploading(true);

        try {
            let uploadedCount = 0;
            for (const file of Array.from(selectedFiles)) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/admin/bucket", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (!data.success) {
                    showToast("error", data.message || `Failed to upload ${file.name}`);
                } else {
                    uploadedCount++;
                }
            }

            if (uploadedCount > 0) {
                showToast("success", `${uploadedCount} file(s) uploaded successfully`);
            }

            // Refresh with cache bypass after upload
            fetchFiles(true);
        } catch {
            showToast("error", "Failed to upload files");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDelete = async (fileName: string) => {
        try {
            const response = await fetch("/api/admin/bucket", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName }),
            });

            const data = await response.json();

            if (data.success) {
                setDeleteConfirm(null);
                setSelectedFile(null);
                fetchFiles(true);
                showToast("success", "File deleted successfully");
            } else {
                showToast("error", data.message || "Failed to delete file");
            }
        } catch {
            showToast("error", "Failed to delete file");
        }
    };

    const handleRename = async () => {
        if (!renameFile || !renameFile.newName.trim()) return;

        try {
            const response = await fetch("/api/admin/bucket", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldName: renameFile.name,
                    newName: renameFile.newName.trim(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                fetchFiles(true);
                setRenameFile(null);
                setSelectedFile(null);
                showToast("success", "File renamed successfully");
            } else {
                showToast("error", data.message || "Failed to rename file");
            }
        } catch {
            showToast("error", "Failed to rename file");
        }
    };

    const copyToClipboard = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
        } catch {
            showToast("error", "Failed to copy to clipboard");
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "Unknown";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const isImage = (file: BucketFile) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
        return imageExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Storage Bucket</h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="utility"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        icon={<RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />}
                    >
                        Refresh
                    </Button>
                    <label className="inline-flex items-center justify-center font-medium rounded-md transition-colors px-3 py-1.5 text-sm gap-1.5 bg-accent text-white hover:bg-accent/90 cursor-pointer">
                        <Upload size={14} />
                        {isUploading ? "Uploading..." : "Upload"}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={isUploading}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Files List */}
            {isLoading ? (
                <div className="p-8 text-center text-foreground/50">Loading files...</div>
            ) : files.length === 0 ? (
                <div className="p-8 rounded-lg border border-(--border-color) bg-(--post-card) text-center">
                    <Image size={48} className="mx-auto mb-4 text-foreground/30" />
                    <p className="text-foreground/50">No files in bucket</p>
                    <p className="text-sm text-foreground/30 mt-2">Upload images to get started</p>
                </div>
            ) : (
                <div className="rounded-lg border border-(--border-color) bg-(--post-card) divide-y divide-(--border-color)">
                    {files.map((file) => (
                        <div
                            key={file.id || file.name}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedFile(file)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedFile(file);
                                }
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-foreground/5 transition-colors text-left cursor-pointer"
                        >
                            {/* Thumbnail */}
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-foreground/5 flex-shrink-0 flex items-center justify-center">
                                {isImage(file) ? (
                                    <img
                                        src={file.publicUrl}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <File size={20} className="text-foreground/30" />
                                )}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-foreground/50">
                                    {formatFileSize(file.metadata?.size)}
                                </p>
                            </div>
                            
                            {/* Quick copy button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(file.publicUrl);
                                }}
                                className="p-2 rounded-md hover:bg-foreground/10 transition-colors text-foreground/50 hover:text-foreground cursor-pointer"
                                title="Copy URL"
                            >
                                {copiedUrl === file.publicUrl ? (
                                    <Check size={16} className="text-green-500" />
                                ) : (
                                    <Copy size={16} />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* File Detail Popup */}
            {selectedFile && (
                <div
                    className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => {
                        setSelectedFile(null);
                        setDeleteConfirm(null);
                        setRenameFile(null);
                    }}
                >
                    <div
                        className="relative w-full max-w-lg mx-4 p-6 rounded-xl border border-(--border-color) bg-background shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground truncate pr-4">
                                {selectedFile.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setDeleteConfirm(null);
                                    setRenameFile(null);
                                }}
                                className="p-1 text-foreground/50 hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="aspect-video bg-foreground/5 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                            {isImage(selectedFile) ? (
                                <img
                                    src={selectedFile.publicUrl}
                                    alt={selectedFile.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <File size={64} className="text-foreground/30" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="text-sm text-foreground/60 mb-4 space-y-1">
                            <p><span className="text-foreground/80">Size:</span> {formatFileSize(selectedFile.metadata?.size)}</p>
                            <p className="truncate"><span className="text-foreground/80">URL:</span> {selectedFile.publicUrl}</p>
                        </div>

                        {/* Rename Input */}
                        {renameFile && renameFile.name === selectedFile.name && (
                            <div className="mb-4">
                                <p className="text-sm text-foreground/70 mb-2">Rename file:</p>
                                <p className="text-yellow-500 text-xs mb-2">
                                    ⚠️ Posts using this image will need their URLs updated manually.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={renameFile.newName}
                                        onChange={(e) => setRenameFile({ ...renameFile, newName: e.target.value })}
                                        className="flex-1 px-3 py-2 text-sm rounded-md border border-(--border-color) bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleRename();
                                            if (e.key === "Escape") setRenameFile(null);
                                        }}
                                    />
                                    <Button variant="cancel" size="sm" onClick={() => setRenameFile(null)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={handleRename}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Delete Confirmation */}
                        {deleteConfirm === selectedFile.name && (
                            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-foreground font-medium mb-2">Delete this file?</p>
                                <p className="text-yellow-500 text-xs mb-3">
                                    ⚠️ Posts using this image will need their URLs updated manually.
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="cancel" size="sm" onClick={() => setDeleteConfirm(null)}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(selectedFile.name)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {!renameFile && deleteConfirm !== selectedFile.name && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="utility"
                                    size="sm"
                                    icon={copiedUrl === selectedFile.publicUrl ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    onClick={() => copyToClipboard(selectedFile.publicUrl)}
                                >
                                    {copiedUrl === selectedFile.publicUrl ? "Copied!" : "Copy URL"}
                                </Button>
                                <a
                                    href={selectedFile.publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-(--border-color) text-foreground/70 hover:border-accent hover:text-accent transition-colors"
                                >
                                    <ExternalLink size={14} />
                                    Open
                                </a>
                                <Button
                                    variant="attention"
                                    size="sm"
                                    icon={<Pencil size={14} />}
                                    onClick={() => setRenameFile({ name: selectedFile.name, newName: selectedFile.name })}
                                >
                                    Rename
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    icon={<Trash2 size={14} />}
                                    onClick={() => setDeleteConfirm(selectedFile.name)}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
