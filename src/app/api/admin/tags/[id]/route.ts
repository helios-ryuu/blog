import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// DELETE - Delete a tag
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tagId = parseInt(id);

        if (isNaN(tagId)) {
            return NextResponse.json(
                { success: false, message: "Invalid tag ID" },
                { status: 400 }
            );
        }

        // Delete post_tags associations first
        await sql`DELETE FROM post_tags WHERE tag_id = ${tagId}`;

        // Delete the tag
        const result = await sql`
            DELETE FROM tag WHERE id = ${tagId}
            RETURNING id
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Tag not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Tag deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting tag:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete tag" },
            { status: 500 }
        );
    }
}
