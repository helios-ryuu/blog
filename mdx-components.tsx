import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-medium mt-4 mb-2">{children}</h3>
        ),
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
        pre: ({ children }) => (
            <pre
                className="bg-(--code-block) text-gray-100 border border-(--code-block-border) p-4 rounded-lg overflow-x-auto my-4 [&>code]:p-0 [&>code]:bg-transparent [&>code]:rounded-none"
                style={{ fontFamily: 'var(--font-fira-code), monospace' }}
            >
                {children}
            </pre>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-4 my-4 italic">
                {children}
            </blockquote>
        ),
        a: ({ href, children }) => (
            <a href={href} className="text-accent hover:underline">
                {children}
            </a>
        ),
        ...components,
    };
}
