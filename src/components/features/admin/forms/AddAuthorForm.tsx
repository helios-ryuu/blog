"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { FormField, FormInput, FormMessage } from "../common/FormFields";
import { Button } from "../common/Button";

interface AddAuthorFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

export default function AddAuthorForm({ onSuccess, onClose }: AddAuthorFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        avatar_url: "",
        github_url: "",
        linkedin_url: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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
            const response = await fetch("/api/admin/authors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                onSuccess();
            } else {
                setError(data.message || "Failed to create author");
            }
        } catch {
            setError("Failed to create author");
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

                <h2 className="text-xl font-bold text-accent tracking-wider mb-6">ADD AUTHOR</h2>

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
                            variant="primary"
                            disabled={isLoading}
                            isLoading={isLoading}
                            loadingText="Creating..."
                            fullWidth
                        >
                            Create Author
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
