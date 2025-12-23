import Link from "next/link";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-3.5rem-3rem)]">
      <h1 className="text-4xl font-bold mb-2">Helios Blog</h1>
      <p className="text-foreground/60 mb-8">Sharing my thoughts with the world</p>

      <Link href="/post">
        <Button>
          Go to posts
        </Button>
      </Link>
    </div>
  );
}
