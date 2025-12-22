import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="mt-2 text-foreground/70">Welcome to Helios Blog</p>

      <div className="mt-6">
        <Link
          href="/blog"
          className="text-accent hover:underline"
        >
          View all posts →
        </Link>
      </div>
    </div>
  );
}
