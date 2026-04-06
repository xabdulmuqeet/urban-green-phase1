"use client";

import { Badge } from "@/components/Badge";
import { Button, buttonStyles } from "@/components/Button";
import Link from "next/link";

export default function ProductError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section-space">
      <div className="page-shell">
        <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-black/6 bg-white px-8 py-12 text-center shadow-card">
          <Badge tone="accent">Plant Page</Badge>
          <h1 className="mt-6 font-[family:var(--font-heading)] text-4xl text-foreground sm:text-5xl">
            This product page needs another moment.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-bark/80">
            We couldn&apos;t finish loading this plant detail page. Try once more, or return to the
            shop and continue from the full collection.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => reset()}>Try Again</Button>
            <Link href="/shop" className={buttonStyles({ variant: "secondary" })}>
              Go back to shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
