import type { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`premium-skeleton animate-shimmer rounded-[1rem] ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({
  className = "",
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-[2rem] border border-black/5 bg-white p-6 shadow-card ${className}`.trim()}>
      {children}
    </div>
  );
}
