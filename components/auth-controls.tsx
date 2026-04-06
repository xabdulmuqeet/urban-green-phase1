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
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="bg-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#486730]"
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
        className={
          mobile
            ? "rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-sage hover:text-sage"
            : "inline-flex h-10 w-10 items-center justify-center text-[#516448] transition-transform duration-200 hover:scale-95"
        }
      >
        {mobile ? (
          "Sign In"
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
          </svg>
        )}
      </button>

      {isOpen ? (
        <div
          className={`${
            mobile
              ? "mt-3 w-full"
              : "absolute right-0 top-full mt-4 w-[23rem]"
          } border border-[#eceee7] bg-[#fdfdf9] p-10 shadow-[0_28px_70px_rgba(53,73,42,0.12)]`}
        >
          <h2 className="font-[family:var(--font-heading)] text-[2.15rem] leading-none tracking-[-0.04em] text-[#41473a]">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="mt-3 font-[family:var(--font-body)] text-[15px] leading-6 text-[#7b8373]">
            {mode === "signup"
              ? "Join the archive and keep your curated plant selections close."
              : "Access your curated botanical archive."}
          </p>

          <div className="mt-10">
            {mode === "signup" ? (
              <div className="mb-7">
                <label className="block font-[family:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f9177]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="mt-3 h-11 w-full border-0 border-b border-[#e4e7dd] bg-transparent px-0 pb-1 font-[family:var(--font-body)] text-[17px] text-[#4c5444] outline-none transition placeholder:text-[#a4ab9d] focus:border-[#7f9177]"
                />
              </div>
            ) : null}

            <div className="mb-7">
              <label className="block font-[family:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f9177]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="archivist@verdant.com"
                className="mt-3 h-11 w-full border-0 border-b border-[#e4e7dd] bg-transparent px-0 pb-1 font-[family:var(--font-body)] text-[17px] text-[#4c5444] outline-none transition placeholder:text-[#a4ab9d] focus:border-[#7f9177]"
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between">
                <label className="block font-[family:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f9177]">
                  Password
                </label>
                {mode === "signin" ? (
                  <button
                    type="button"
                    onClick={() => setMessage("Password reset isn't available yet.")}
                    className="font-[family:var(--font-body)] text-[11px] text-[#b1b7a7] transition hover:text-[#7f9177]"
                  >
                    Forgot?
                  </button>
                ) : null}
              </div>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="mt-3 h-11 w-full border-0 border-b border-[#e4e7dd] bg-transparent px-0 pb-1 font-[family:var(--font-body)] text-[17px] text-[#4c5444] outline-none transition placeholder:text-[#4c5444] focus:border-[#7f9177]"
              />
            </div>

            <button
              type="button"
              onClick={() => void handlePasswordAuth()}
              disabled={isSubmitting}
              className="w-full bg-[#536b4a] px-5 py-4 font-[family:var(--font-body)] text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-[#486730] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting
                ? mode === "signup"
                  ? "Creating Account..."
                  : "Signing In..."
                : mode === "signup"
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </div>

          <div className="mt-5 text-center">
            <p className="font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-[#b0b7a7]">
              Or
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMode((current) => (current === "signin" ? "signup" : "signin"));
              setMessage("");
            }}
            className="mt-5 w-full border border-[#e1e5da] bg-transparent px-5 py-4 font-[family:var(--font-body)] text-[11px] uppercase tracking-[0.24em] text-[#a0a89a] transition hover:border-[#cdd5c5] hover:text-[#516448]"
          >
            {mode === "signup" ? "Back To Sign In" : "Create An Account"}
          </button>

          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="mt-6 flex w-full items-center justify-center gap-2 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-[#b0b7a7] transition hover:text-[#7f9177]"
          >
            <span>Continue As Guest</span>
            <span aria-hidden="true" className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>

          {message ? (
            <p className="mt-5 font-[family:var(--font-body)] text-sm leading-6 text-[#516448]/78">
              {message}
            </p>
          ) : null}

          <div className="mt-10 border-t border-[#eef0e8] pt-7">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d39f7a] text-[11px] font-semibold text-white ring-2 ring-[#fdfdf9]">
                  A
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7f9177] text-[11px] font-semibold text-white ring-2 ring-[#fdfdf9]">
                  B
                </span>
              </div>
              <p className="font-[family:var(--font-body)] text-[11px] leading-5 text-[#9da596]">
                Join over 12,000+ botanical enthusiasts archiving their urban jungles.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
