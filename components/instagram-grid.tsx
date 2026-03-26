import Image from "next/image";
import type { InstagramPost } from "@/lib/types";

type InstagramGridProps = {
  posts: InstagramPost[];
};

export function InstagramGrid({ posts }: InstagramGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={`group relative overflow-hidden rounded-[1.75rem] ${
            index % 3 === 0 ? "md:translate-y-8" : ""
          }`}
        >
          <Image
            src={post.image}
            alt={post.title}
            width={700}
            height={760}
            className="h-full min-h-[180px] w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
          <div className="absolute bottom-4 left-4 rounded-full border border-white/80 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#243020] opacity-0 shadow-sm transition duration-500 group-hover:opacity-100">
            {post.title}
          </div>
        </div>
      ))}
    </div>
  );
}
