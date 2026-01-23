"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FormField, FormInput, FormMessage } from "../common/FormFields";
import { Button } from "../common/Button";

interface EditAuthorFormProps {
    authorId: number;
    onSuccess: () => void;
    onClose: () => void;
}

interface AuthorData {
    name: string;
    title: string;
    avatar_url: string;
    github_url: string;
    linkedin_url: string;
}

export default function EditAuthorForm({ authorId, onSuccess, onClose }: EditAuthorFormProps) {
    const [formData, setFormData] = useState<AuthorData>({
        name: "",
        title: "",
        avatar_url: "",
        github_url: "",
        linkedin_url: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const res = await fetch(`/api/admin/authors/${authorId}`);
                const data = await res.json();
                if (data.success) {
                    setFormData({
                        name: data.data.name || "",
                        title: data.data.title || "",
                        avatar_url: data.data.avatar_url || "",
                        github_url: data.data.github_url || "",
                        linkedin_url: data.data.linkedin_url || "",
                    });
                } else {
                    setError(data.message || "Failed to fetch author");
                }
            } catch {
                setError("Failed to fetch author");
            } finally {
                setIsFetching(false);
            }
        };

        fetchAuthor();
    }, [authorId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.name.trim()) {
            setError("Name is required");
            return;
        }

        if (!formData.title.trim()) {
            setError("Title is required");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/admin/authors/${authorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                onSuccess();
            } else {
                setError(data.message || "Failed to update author");
            }
        } catch {
            setError("Failed to update author");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md mx-4 p-6 rounded-xl border border-(--border-color) bg-background shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-foreground/50 hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-accent tracking-wider mb-6">EDIT AUTHOR</h2>

                {isFetching ? (
                    <div className="flex items-center justify-center py-12">
                        <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField 
                            label="Name" 
                            required
                            warning={formData.name.length > 100 ? "Name exceeds 100 characters" : undefined}
                            charCount={{ current: formData.name.length, max: 100 }}
                        >
                            <FormInput
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter author name"
                                hasWarning={formData.name.length > 100}
                                autoFocus
                            />
                        </FormField>

                        <FormField 
                            label="Title" 
                            required
                            warning={formData.title.length > 200 ? "Title exceeds 200 characters" : undefined}
                            charCount={{ current: formData.title.length, max: 200 }}
                        >
                            <FormInput
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Software Engineer"
                                hasWarning={formData.title.length > 200}
                            />
                        </FormField>

                        <FormField label="Avatar URL">
                            <FormInput
                                name="avatar_url"
                                type="url"
                                value={formData.avatar_url}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </FormField>

                        <FormField label="GitHub URL">
                            <FormInput
                                name="github_url"
                                type="url"
                                value={formData.github_url}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                            />
                        </FormField>

                        <FormField label="LinkedIn URL">
                            <FormInput
                                name="linkedin_url"
                                type="url"
                                value={formData.linkedin_url}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </FormField>

                        {error && <FormMessage type="error" message={error} />}

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="cancel"
                                onClick={onClose}
                                fullWidth
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="save"
                                disabled={isLoading}
                                isLoading={isLoading}
                                loadingText="Saving..."
                                fullWidth
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
