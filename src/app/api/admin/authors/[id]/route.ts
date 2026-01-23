import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// GET - Get an author by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const authorId = parseInt(id);

        if (isNaN(authorId)) {
            return NextResponse.json(
                { success: false, message: "Invalid author ID" },
                { status: 400 }
            );
        }

        const authors = await sql`
            SELECT id, name, title, avatar_url, github_url, linkedin_url
            FROM author WHERE id = ${authorId}
        `;

        if (authors.length === 0) {
            return NextResponse.json(
                { success: false, message: "Author not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: authors[0],
        });
    } catch (error) {
        console.error("Error fetching author:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch author" },
            { status: 500 }
        );
    }
}

// PUT - Update an author
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const authorId = parseInt(id);

        if (isNaN(authorId)) {
            return NextResponse.json(
                { success: false, message: "Invalid author ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, title, avatar_url, github_url, linkedin_url } = body;

        if (!name?.trim()) {
            return NextResponse.json(
                { success: false, message: "Name is required" },
                { status: 400 }
            );
        }

        if (!title?.trim()) {
            return NextResponse.json(
                { success: false, message: "Title is required" },
                { status: 400 }
            );
        }

        const result = await sql`
            UPDATE author SET
                name = ${name.trim()},
                title = ${title.trim()},
                avatar_url = ${avatar_url?.trim() || null},
                github_url = ${github_url?.trim() || null},
                linkedin_url = ${linkedin_url?.trim() || null}
            WHERE id = ${authorId}
            RETURNING id, name, title
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Author not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Author updated successfully",
            data: result[0],
        });
    } catch (error) {
        console.error("Error updating author:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update author" },
            { status: 500 }
        );
    }
}

// DELETE - Delete an author
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const authorId = parseInt(id);

        if (isNaN(authorId)) {
            return NextResponse.json(
                { success: false, message: "Invalid author ID" },
                { status: 400 }
            );
        }

        // Check if author has posts
        const posts = await sql`
            SELECT id FROM post WHERE author_id = ${authorId} LIMIT 1
        `;

        if (posts.length > 0) {
            return NextResponse.json(
                { success: false, message: "Cannot delete author with existing posts. Please reassign or delete posts first." },
                { status: 400 }
            );
        }

        // Delete the author
        const result = await sql`
            DELETE FROM author WHERE id = ${authorId}
            RETURNING id
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Author not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Author deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting author:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete author" },
            { status: 500 }
        );
    }
}
