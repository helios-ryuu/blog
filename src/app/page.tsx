import Link from "next/link";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center md:py-50 py-70">
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-2 text-center">Helios Blog</h1>
        <p className="text-foreground/60 mb-8 text-center">Sharing my thoughts with the world</p>

        <div className="flex justify-center">
          <Link href="/post">
            <Button variant="primary">
              Go to posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


