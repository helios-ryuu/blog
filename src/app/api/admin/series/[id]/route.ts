import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE - Delete a series and all its posts (cascade)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const seriesId = parseInt(id, 10);

        if (isNaN(seriesId)) {
            return NextResponse.json(
                { success: false, message: "Invalid series ID" },
                { status: 400 }
            );
        }

        // Get all posts in this series
        const postsInSeries = await sql`
            SELECT id FROM post WHERE series_id = ${seriesId}
        `;

        // Delete post_tags for all posts in series
        for (const post of postsInSeries) {
            await sql`DELETE FROM post_tags WHERE post_id = ${post.id}`;
        }

        // Delete all posts in series
        await sql`DELETE FROM post WHERE series_id = ${seriesId}`;

        // Delete the series
        const result = await sql`
            DELETE FROM series WHERE id = ${seriesId}
            RETURNING id, name
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Series not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Series and all related posts deleted successfully",
            data: {
                deletedPostsCount: postsInSeries.length,
                seriesName: result[0].name,
            },
        });
    } catch (error) {
        console.error("Error deleting series:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete series" },
            { status: 500 }
        );
    }
}

// GET - Get series with related posts count
export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const seriesId = parseInt(id, 10);

        if (isNaN(seriesId)) {
            return NextResponse.json(
                { success: false, message: "Invalid series ID" },
                { status: 400 }
            );
        }

        const series = await sql`
            SELECT s.*, 
                   COUNT(p.id)::int as post_count
            FROM series s
            LEFT JOIN post p ON s.id = p.series_id
            WHERE s.id = ${seriesId}
            GROUP BY s.id
        `;

        if (series.length === 0) {
            return NextResponse.json(
                { success: false, message: "Series not found" },
                { status: 404 }
            );
        }

        // Get posts in this series
        const posts = await sql`
            SELECT id, title, slug, published
            FROM post
            WHERE series_id = ${seriesId}
            ORDER BY series_order ASC NULLS LAST, created_at ASC
        `;

        return NextResponse.json({
            success: true,
            data: { ...series[0], posts },
        });
    } catch (error) {
        console.error("Error fetching series:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch series" },
            { status: 500 }
        );
    }
}

// PUT - Update a series (name and slug)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const seriesId = parseInt(id, 10);

        if (isNaN(seriesId)) {
            return NextResponse.json(
                { success: false, message: "Invalid series ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, slug, description } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { success: false, message: "Name and slug are required" },
                { status: 400 }
            );
        }

        // Update the series
        const result = await sql`
            UPDATE series
            SET name = ${name}, slug = ${slug}, description = ${description || null}
            WHERE id = ${seriesId}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Series not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Series updated successfully",
            data: result[0],
        });
    } catch (error) {
        console.error("Error updating series:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update series" },
            { status: 500 }
        );
    }
}
