import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// POST - Create a new tag
export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();

        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { success: false, message: "Tag name is required" },
                { status: 400 }
            );
        }

        const trimmedName = name.trim();

        if (trimmedName.length === 0) {
            return NextResponse.json(
                { success: false, message: "Tag name cannot be empty" },
                { status: 400 }
            );
        }

        if (trimmedName.length > 15) {
            return NextResponse.json(
                { success: false, message: "Tag name must be 15 characters or less" },
                { status: 400 }
            );
        }

        // Generate slug from name
        const slug = trimmedName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        // Check if tag already exists
        const existing = await sql`
            SELECT id FROM tag WHERE name = ${trimmedName} OR slug = ${slug}
        `;

        if (existing.length > 0) {
            return NextResponse.json(
                { success: false, message: "Tag already exists" },
                { status: 409 }
            );
        }

        // Insert new tag
        const result = await sql`
            INSERT INTO tag (name, slug)
            VALUES (${trimmedName}, ${slug})
            RETURNING *
        `;

        return NextResponse.json({
            success: true,
            message: "Tag created successfully",
            data: result[0],
        });
    } catch (error) {
        console.error("Error creating tag:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create tag" },
            { status: 500 }
        );
    }
}

// GET - Fetch all tags
export async function GET() {
    try {
        const tags = await sql`SELECT * FROM tag ORDER BY name ASC`;
        return NextResponse.json({ success: true, data: tags });
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch tags" },
            { status: 500 }
        );
    }
}
