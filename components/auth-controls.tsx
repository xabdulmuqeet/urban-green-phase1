"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type AuthControlsProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function AuthControls({ mobile = false, onNavigate }: AuthControlsProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordAuth = async () => {
    if (!email || !password) {
      setMessage("Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    if (mode === "signup") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          name
        })
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setIsSubmitting(false);
        setMessage(payload?.error ?? "Failed to create account.");
        return;
      }
    }

    const result = await signIn("password-login", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: "/"
    });

    setIsSubmitting(false);

    if (result?.error || !result?.ok) {
      setMessage("We couldn't sign you in with those credentials.");
      return;
    }

    setMessage(mode === "signup" ? "Account created and signed in." : "Signed in successfully.");
    setPassword("");
    setName("");
    setEmail("");
    setIsOpen(false);
    onNavigate?.();
    router.refresh();
  };

  const handleContinueAsGuest = () => {
    setIsOpen(false);
    setMessage("");
    onNavigate?.();
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
          <p className="text-sm font-medium text-foreground">
            {session.user.name ?? session.user.email}
          </p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-bark/60">Signed In</p>
        </div>
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
            mobile ? "mt-3 w-full rounded-[1.75rem]" : "absolute right-0 top-full mt-3 w-[22rem] rounded-[1.9rem]"
          } border border-black/8 bg-[#fcfbf7] p-5 shadow-[0_24px_60px_rgba(36,48,32,0.14)]`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bark/55">
            Your Account
          </p>
          <p className="mt-2 text-sm leading-6 text-bark/72">
            Sign in to save favorites, track orders, and return to your picks anytime.
          </p>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${mode === "signin" ? "bg-sage text-white" : "bg-cream text-bark/70"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${mode === "signup" ? "bg-sage text-white" : "bg-cream text-bark/70"}`}
            >
              Create Account
            </button>
          </div>

          <div className="mt-5 rounded-[1.5rem] bg-cream/35 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-bark/60">
            {mode === "signup" ? "Create your account" : "Password sign in"}
          </p>
          {mode === "signup" ? (
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="mt-3 w-full rounded-2xl border border-black/10 bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-sage"
            />
          ) : null}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-3 w-full rounded-2xl border border-black/10 bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-sage"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="mt-3 w-full rounded-2xl border border-black/10 bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-sage"
          />
          <button
            type="button"
            onClick={() => void handlePasswordAuth()}
            disabled={isSubmitting}
            className="mt-3 w-full rounded-full bg-terracotta px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#cd624b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting
              ? mode === "signup"
                ? "Creating Account..."
                : "Signing In..."
              : mode === "signup"
                ? "Create Account"
                : "Sign In With Password"}
          </button>
          </div>

          <div className="mt-4 border-t border-black/5 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark/55">
              Prefer to browse first?
            </p>
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="mt-3 w-full rounded-full border border-black/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition hover:border-sage hover:text-sage"
          >
            Continue As Guest
          </button>
          </div>
          {message ? <p className="mt-3 text-sm text-bark/70">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
