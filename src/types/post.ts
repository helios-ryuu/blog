export type Level = "beginner" | "intermediate" | "advanced";

export interface PostFrontmatter {
    author?: string;
    authorTitle?: string;
    title: string;
    description: string;
    date: string;
    image?: string;
    tags?: string[];
    level?: Level;
}

export interface Post extends PostFrontmatter {
    slug: string;
    content: string;
    readingTime: string;
}

export interface PostMeta extends PostFrontmatter {
    slug: string;
    readingTime: string;
}
