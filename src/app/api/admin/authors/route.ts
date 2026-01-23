import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// GET - Fetch all authors
export async function GET() {
    try {
        const authors = await sql`SELECT id, name, title FROM author ORDER BY name ASC`;
        return NextResponse.json({ success: true, data: authors });
    } catch (error) {
        console.error("Error fetching authors:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch authors" },
            { status: 500 }
        );
    }
}

// POST - Create a new author
export async function POST(request: NextRequest) {
    try {
        const { name, title, avatar_url, github_url, linkedin_url } = await request.json();

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

        // Check if author already exists
        const existing = await sql`
            SELECT id FROM author WHERE name = ${name.trim()}
        `;

        if (existing.length > 0) {
            return NextResponse.json(
                { success: false, message: "Author with this name already exists" },
                { status: 409 }
            );
        }

        // Insert new author
        const result = await sql`
            INSERT INTO author (name, title, avatar_url, github_url, linkedin_url)
            VALUES (${name.trim()}, ${title.trim()}, ${avatar_url?.trim() || null}, ${github_url?.trim() || null}, ${linkedin_url?.trim() || null})
            RETURNING *
        `;

        return NextResponse.json({
            success: true,
            message: "Author created successfully",
            data: result[0],
        });
    } catch (error) {
        console.error("Error creating author:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create author" },
            { status: 500 }
        );
    }
}
