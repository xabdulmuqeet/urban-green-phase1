import { NextResponse } from "next/server";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
  message?: string;
};

const buckets = new Map<string, RateLimitBucket>();

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const connectingIp = request.headers.get("cf-connecting-ip");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    realIp?.trim() ||
    connectingIp?.trim() ||
    "unknown"
  );
}

export function rateLimit(request: Request, options: RateLimitOptions) {
  const identifier = `${options.keyPrefix}:${getClientIdentifier(request)}`;
  const now = Date.now();
  const current = buckets.get(identifier);

  if (!current || current.resetAt <= now) {
    buckets.set(identifier, {
      count: 1,
      resetAt: now + options.windowMs
    });

    return null;
  }

  if (current.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));

    return NextResponse.json(
      {
        error:
          options.message ??
          "Too many requests. Please wait a moment and try again."
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds)
        }
      }
    );
  }

  current.count += 1;
  buckets.set(identifier, current);
  return null;
}
