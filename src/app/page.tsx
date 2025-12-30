import Link from "next/link";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-50">
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
