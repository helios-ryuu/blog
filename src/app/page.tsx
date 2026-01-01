import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center md:py-50 py-60 px-6">
      {/* Content */}
      <div className="relative z-10 max-w-xl text-center">
        {/* Greeting */}
        <p className="md:text-3xl text-lg text-accent font-medium tracking-wide mb-4 md:whitespace-nowrap whitespace-normal">
          Welcome to my corner of the internet
        </p>

        {/* Subtitle */}
        <p className="text-foreground/60 mb-8 md:text-sm text-xs leading-relaxed whitespace-normal px-6">
          Thoughts, experiments, and learnings about software engineering, technology, and everything in between.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link href="/post" className="flex items-center group">
            <span className="font-bold text-foreground/40 group-hover:text-foreground smooth-text">Explore posts</span>
            <span className="w-6 ml-2 flex items-center">
              <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground smooth-text arrow-animate" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
