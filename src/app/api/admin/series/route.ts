import { NextResponse } from "next/server";
import sql from "@/lib/db";

// GET - Fetch all series
export async function GET() {
    try {
        const series = await sql`SELECT * FROM series ORDER BY name ASC`;
        return NextResponse.json({ success: true, data: series });
    } catch (error) {
        console.error("Error fetching series:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch series" },
            { status: 500 }
        );
    }
}
