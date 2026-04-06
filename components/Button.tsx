import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-medium tracking-[0.18em] uppercase transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-terracotta text-white shadow-[0_18px_40px_rgba(81,100,72,0.18)] hover:bg-[#486730]",
  secondary:
    "border border-black/8 bg-white text-foreground shadow-[0_12px_28px_rgba(62,79,55,0.06)] hover:bg-cream/90",
  ghost: "border border-transparent bg-transparent text-foreground hover:bg-cream/60"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-[11px]",
  md: "min-h-12 px-6 text-xs",
  lg: "min-h-14 px-7 text-sm"
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = ""
}: ButtonStyleOptions = {}) {
  return joinClasses(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth = false, className, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...props}
    />
  );
});
