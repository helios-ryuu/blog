import type { MDXComponents } from "mdx/types";
import CodeBlock from "@/components/ui/CodeBlock";

// Helper to create URL-friendly slug from text
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => {
            const id = slugify(String(children));
            return <h2 id={id} className="text-3xl font-semibold mt-6 mb-3 scroll-mt-20">{children}</h2>;
        },
        h3: ({ children }) => {
            const id = slugify(String(children));
            return <h3 id={id} className="text-2xl font-medium mt-4 mb-2 scroll-mt-20">{children}</h3>;
        },
        p: ({ children }) => (
            <p className="my-4 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>
        ),
        // Inline code - for code blocks, code inside pre will have styles reset
        code: ({ children, className, ...props }) => {
            // If has language class, it's inside a pre block - pass through
            if (className?.includes('language-')) {
                return <code className={className} {...props}>{children}</code>;
            }
            // Inline code styling
            return (
                <code
                    className="bg-(--code-block) text-gray-100 px-1.5 py-0.5 rounded text-sm"
                    style={{ fontFamily: 'var(--font-fira-code), monospace' }}
                >
                    {children}
                </code>
            );
        },
        pre: ({ children, ...props }) => (
            <CodeBlock {...props}>
                {children}
            </CodeBlock>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-4 my-4 italic">
                {children}
            </blockquote>
        ),
        table: ({ children }) => (
            <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-(--border-color)">
                    {children}
                </table>
            </div>
        ),
        thead: ({ children }) => (
            <thead className="bg-(--post-card)">{children}</thead>
        ),
        tbody: ({ children }) => (
            <tbody>{children}</tbody>
        ),
        tr: ({ children }) => (
            <tr className="border-b border-(--border-color)">{children}</tr>
        ),
        th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold border-r border-(--border-color) last:border-r-0">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="px-4 py-2 border-r border-(--border-color) last:border-r-0">
                {children}
            </td>
        ),
        a: ({ href, children }) => (
            <a href={href} className="text-accent hover:underline">
                {children}
            </a>
        ),
        ...components,
    };
}
