"use client";

import { FileText, Tag, Users, Plus } from "lucide-react";
import { SectionCard } from "../common/SectionCard";

interface CreateSectionProps {
    onAddPost: () => void;
    onAddTag: () => void;
    onAddAuthor: () => void;
}

export default function CreateSection({ onAddPost, onAddTag, onAddAuthor }: CreateSectionProps) {
    return (
        <div className="bg-accent/5 p-6 rounded-lg border border-accent/70">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus size={20} className="text-accent" />
                Create
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                <SectionCard
                    title="Add Post"
                    description="Create a new blog post. Posts are saved as drafts until published."
                    onClick={onAddPost}
                    icon={FileText}
                />
                <SectionCard
                    title="Add Tag"
                    description="Create a new tag for categorizing posts (max 15 characters)."
                    onClick={onAddTag}
                    icon={Tag}
                />
                <SectionCard
                    title="Add Author"
                    description="Create a new author with profile information."
                    onClick={onAddAuthor}
                    icon={Users}
                />
            </div>
        </div>
    );
}
