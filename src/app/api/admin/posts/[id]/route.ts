import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import sql from "@/lib/db";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT - Update a post
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            return NextResponse.json(
                { success: false, message: "Invalid post ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const {
            title,
            description,
            content,
            image_url,
            level,
            type,
            series_id,
            series_order,
            author_id,
            reading_time,
            tag_ids,
        } = body;

        // Format reading time if it's a number
        const formattedReadingTime = typeof reading_time === "number"
            ? `${reading_time} min read`
            : reading_time;

        // Update the post
        const result = await sql`
            UPDATE post
            SET 
                title = ${title},
                description = ${description},
                content = ${content},
                image_url = ${image_url},
                level = ${level},
                type = ${type},
                series_id = ${series_id || null},
                series_order = ${series_order || null},
                author_id = ${author_id},
                reading_time = ${formattedReadingTime},
                updated_at = NOW()
            WHERE id = ${postId}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        // Update tags - delete existing and insert new
        await sql`DELETE FROM post_tags WHERE post_id = ${postId}`;

        if (tag_ids && tag_ids.length > 0) {
            for (const tagId of tag_ids) {
                await sql`
                    INSERT INTO post_tags (post_id, tag_id)
                    VALUES (${postId}, ${tagId})
                    ON CONFLICT DO NOTHING
                `;
            }
        }

        // Revalidate cache
        revalidateTag("posts", "max");
        revalidateTag("admin-data", "max");
        revalidateTag("admin-drafts", "max");
        if (result[0].slug) {
            revalidateTag(`post-${result[0].slug}`, "max");
            revalidatePath(`/post/${result[0].slug}`);
        }
        revalidatePath("/");
        revalidatePath("/blog");

        return NextResponse.json({
            success: true,
            message: "Post updated successfully",
            data: result[0],
        });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update post" },
            { status: 500 }
        );
    }
}

// PATCH - Publish a post
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            return NextResponse.json(
                { success: false, message: "Invalid post ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { action } = body;

        if (action === "publish") {
            const result = await sql`
                UPDATE post
                SET published = true, published_at = NOW(), updated_at = NOW()
                WHERE id = ${postId}
                RETURNING *
            `;

            if (result.length === 0) {
                return NextResponse.json(
                    { success: false, message: "Post not found" },
                    { status: 404 }
                );
            }

            // Revalidate cache
            revalidateTag("posts", "max");
            revalidateTag("admin-data", "max");
            revalidateTag("admin-drafts", "max");
            if (result[0].slug) {
                revalidateTag(`post-${result[0].slug}`, "max");
                revalidatePath(`/post/${result[0].slug}`);
            }
            revalidatePath("/");
            revalidatePath("/blog");

            return NextResponse.json({
                success: true,
                message: "Post published successfully",
                data: result[0],
            });
        }

        if (action === "unpublish") {
            const result = await sql`
                UPDATE post
                SET published = false, published_at = NULL, updated_at = NOW()
                WHERE id = ${postId}
                RETURNING *
            `;

            if (result.length === 0) {
                return NextResponse.json(
                    { success: false, message: "Post not found" },
                    { status: 404 }
                );
            }

            // Revalidate cache
            revalidateTag("posts", "max");
            revalidateTag("admin-data", "max");
            revalidateTag("admin-drafts", "max");
            if (result[0].slug) {
                revalidateTag(`post-${result[0].slug}`, "max");
                revalidatePath(`/post/${result[0].slug}`);
            }
            revalidatePath("/");
            revalidatePath("/blog");

            return NextResponse.json({
                success: true,
                message: "Post unpublished successfully",
                data: result[0],
            });
        }

        return NextResponse.json(
            { success: false, message: "Invalid action" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update post" },
            { status: 500 }
        );
    }
}

// GET - Fetch a single post by ID
export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            return NextResponse.json(
                { success: false, message: "Invalid post ID" },
                { status: 400 }
            );
        }

        const posts = await sql`
            SELECT p.*, a.name as author_name, s.name as series_name
            FROM post p
            LEFT JOIN author a ON p.author_id = a.id
            LEFT JOIN series s ON p.series_id = s.id
            WHERE p.id = ${postId}
        `;

        if (posts.length === 0) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        const post = posts[0];

        // Fetch tags
        const tags = await sql`
            SELECT t.id, t.name, t.slug
            FROM tag t
            INNER JOIN post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = ${postId}
        `;

        return NextResponse.json({
            success: true,
            data: { ...post, tags },
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a post
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            return NextResponse.json(
                { success: false, message: "Invalid post ID" },
                { status: 400 }
            );
        }

        // Delete post tags first
        await sql`DELETE FROM post_tags WHERE post_id = ${postId}`;

        // Delete the post
        const result = await sql`
            DELETE FROM post WHERE id = ${postId}
            RETURNING id, slug
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        // Revalidate cache
        revalidateTag("posts", "max");
        revalidateTag("admin-data", "max");
        revalidateTag("admin-drafts", "max");
        if (result[0].slug) {
            revalidateTag(`post-${result[0].slug}`, "max");
        }
        revalidatePath("/");
        revalidatePath("/blog");

        return NextResponse.json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete post" },
            { status: 500 }
        );
    }
}
