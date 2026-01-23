import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// POST - Create a new post (as draft)
export async function POST(request: NextRequest) {
    try {
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
            series_name,
            series_description,
            author_id,
            reading_time,
            tag_ids,
        } = body;

        // Validate required fields
        if (!title?.trim()) {
            return NextResponse.json(
                { success: false, message: "Title is required" },
                { status: 400 }
            );
        }
        if (!description?.trim()) {
            return NextResponse.json(
                { success: false, message: "Description is required" },
                { status: 400 }
            );
        }
        if (!content?.trim()) {
            return NextResponse.json(
                { success: false, message: "Content is required" },
                { status: 400 }
            );
        }
        if (!image_url?.trim()) {
            return NextResponse.json(
                { success: false, message: "Image URL is required" },
                { status: 400 }
            );
        }
        if (!level?.trim()) {
            return NextResponse.json(
                { success: false, message: "Level is required" },
                { status: 400 }
            );
        }
        if (!author_id) {
            return NextResponse.json(
                { success: false, message: "Author is required" },
                { status: 400 }
            );
        }
        if (!reading_time) {
            return NextResponse.json(
                { success: false, message: "Reading time is required" },
                { status: 400 }
            );
        }

        // Format reading time
        const formattedReadingTime = `${reading_time} min read`;

        // Validate tags (max 3)
        if (tag_ids && tag_ids.length > 3) {
            return NextResponse.json(
                { success: false, message: "Maximum 3 tags allowed" },
                { status: 400 }
            );
        }

        // Generate slug from title
        const slug = title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        // Check if slug or title already exists
        const existing = await sql`
            SELECT id FROM post WHERE slug = ${slug} OR title = ${title.trim()}
        `;
        if (existing.length > 0) {
            return NextResponse.json(
                { success: false, message: "A post with this title already exists" },
                { status: 409 }
            );
        }

        // Handle series creation if type is 'series' and new series name provided
        let finalSeriesId = series_id || null;
        if (type === "series") {
            if (!series_id && series_name?.trim()) {
                // Create new series
                const seriesSlug = series_name
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-");

                const existingSeries = await sql`
                    SELECT id FROM series WHERE slug = ${seriesSlug} OR name = ${series_name.trim()}
                `;

                if (existingSeries.length > 0) {
                    finalSeriesId = existingSeries[0].id;
                } else {
                    const newSeries = await sql`
                        INSERT INTO series (name, slug, description)
                        VALUES (${series_name.trim()}, ${seriesSlug}, ${series_description || null})
                        RETURNING id
                    `;
                    finalSeriesId = newSeries[0].id;
                }
            }

            if (!finalSeriesId) {
                return NextResponse.json(
                    { success: false, message: "Series is required for series type posts" },
                    { status: 400 }
                );
            }
            if (!series_order) {
                return NextResponse.json(
                    { success: false, message: "Series order is required for series type posts" },
                    { status: 400 }
                );
            }
        }

        // Insert the post as draft
        const result = await sql`
            INSERT INTO post (
                slug, title, description, content, image_url, level, type,
                series_id, series_order, author_id, reading_time, published
            )
            VALUES (
                ${slug}, ${title.trim()}, ${description.trim()}, ${content.trim()},
                ${image_url.trim()}, ${level}, ${type || "standalone"},
                ${finalSeriesId}, ${series_order || null}, ${author_id},
                ${formattedReadingTime}, false
            )
            RETURNING *
        `;

        const postId = result[0].id;

        // Insert post tags
        if (tag_ids && tag_ids.length > 0) {
            for (const tagId of tag_ids) {
                await sql`
                    INSERT INTO post_tags (post_id, tag_id)
                    VALUES (${postId}, ${tagId})
                    ON CONFLICT DO NOTHING
                `;
            }
        }

        return NextResponse.json({
            success: true,
            message: "Post created as draft",
            data: result[0],
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create post" },
            { status: 500 }
        );
    }
}

// GET - Fetch all posts with related data
export async function GET() {
    try {
        const posts = await sql`
            SELECT p.*, a.name as author_name, s.name as series_name
            FROM post p
            LEFT JOIN author a ON p.author_id = a.id
            LEFT JOIN series s ON p.series_id = s.id
            ORDER BY p.created_at DESC
        `;

        // Fetch tags for each post
        const postsWithTags = await Promise.all(
            posts.map(async (post) => {
                const tags = await sql`
                    SELECT t.id, t.name, t.slug
                    FROM tag t
                    INNER JOIN post_tags pt ON t.id = pt.tag_id
                    WHERE pt.post_id = ${post.id}
                `;
                return { ...post, tags };
            })
        );

        return NextResponse.json({ success: true, data: postsWithTags });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
