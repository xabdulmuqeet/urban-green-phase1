"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type AuthControlsProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function AuthControls({ mobile = false, onNavigate }: AuthControlsProps) {
  const isLocalDevLogin = process.env.NODE_ENV !== "production";
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email) {
      setMessage("Enter your email first.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const result = await signIn(isLocalDevLogin ? "dev-email" : "email", {
      email,
      redirect: false,
      callbackUrl: "http://localhost:8090"
    });

    setIsSubmitting(false);

    if (result?.error) {
      setMessage(result.error);
      return;
    }

    setMessage(
      isLocalDevLogin
        ? "Signed in for local testing."
        : "Magic link sent. Check your email."
    );
  };

  if (status === "loading") {
    return (
      <span className={`text-sm text-bark/60 ${mobile ? "" : "whitespace-nowrap"}`}>
        Loading...
      </span>
    );
  }

  if (session?.user) {
    return (
      <div className={`flex ${mobile ? "flex-col items-start gap-3" : "items-center gap-3"}`}>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{session.user.email}</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-bark/60">Signed In</p>
        </div>
        <Link
          href="/orders"
          onClick={onNavigate}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-sage hover:text-sage"
        >
          Orders
        </Link>
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "http://localhost:8090" })}
          className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cd624b]"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${mobile ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-sage hover:text-sage"
      >
        Sign In
      </button>

      {isOpen ? (
        <div
          className={`${
            mobile ? "mt-3 w-full rounded-[1.5rem]" : "absolute right-0 top-full mt-3 w-80 rounded-[1.75rem]"
          } border border-black/5 bg-white p-4 shadow-card`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-bark/60">
            {isLocalDevLogin ? "Local Test Login" : "Email Login"}
          </p>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-3 w-full rounded-2xl border border-black/10 bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-sage"
          />
          <button
            type="button"
            onClick={() => void handleEmailSignIn()}
            disabled={isSubmitting}
            className="mt-3 w-full rounded-full bg-terracotta px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#cd624b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting
              ? isLocalDevLogin
                ? "Signing In..."
                : "Sending..."
              : isLocalDevLogin
                ? "Continue With Email"
                : "Send Magic Link"}
          </button>
          {message ? <p className="mt-3 text-sm text-bark/70">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
