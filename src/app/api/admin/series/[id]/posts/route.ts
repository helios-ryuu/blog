import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// GET - Fetch posts in a series with their orders
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const seriesId = parseInt(id);

        if (isNaN(seriesId)) {
            return NextResponse.json(
                { success: false, message: "Invalid series ID" },
                { status: 400 }
            );
        }

        // Get excludePostId from query params to exclude current post when editing
        const { searchParams } = new URL(request.url);
        const excludePostId = searchParams.get("excludePostId");

        let posts;
        if (excludePostId) {
            const excludeId = parseInt(excludePostId);
            posts = await sql`
                SELECT id, title, series_order
                FROM post
                WHERE series_id = ${seriesId} AND id != ${excludeId}
                ORDER BY series_order ASC
            `;
        } else {
            posts = await sql`
                SELECT id, title, series_order
                FROM post
                WHERE series_id = ${seriesId}
                ORDER BY series_order ASC
            `;
        }

        const existingOrders = posts.map((p) => p.series_order).filter(Boolean);
        const nextOrder = existingOrders.length > 0 
            ? Math.max(...existingOrders) + 1 
            : 1;

        return NextResponse.json({
            success: true,
            data: {
                posts,
                existingOrders,
                nextOrder,
            },
        });
    } catch (error) {
        console.error("Error fetching series posts:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch series posts" },
            { status: 500 }
        );
    }
}
