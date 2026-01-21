import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    const format = request.nextUrl.searchParams.get('format');

    if (format === 'md') {
        const filePath = path.join(process.cwd(), 'src/content/posts', `${slug}.mdx`);
        try {
            if (!fs.existsSync(filePath)) {
                return new NextResponse('File not found', { status: 404 });
            }
            const fileBuffer = fs.readFileSync(filePath);

            return new NextResponse(fileBuffer, {
                headers: {
                    'Content-Disposition': `attachment; filename="${slug}.md"`,
                    'Content-Type': 'text/markdown',
                },
            });
        } catch (error) {
            console.error(error);
            return new NextResponse('Error reading file', { status: 500 });
        }
    }

    return new NextResponse('Invalid format', { status: 400 });
}
