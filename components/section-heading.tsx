type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  tone?: "default" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default"
}: SectionHeadingProps) {
  const isCentered = align === "center";
  const isLight = tone === "light";

  return (
    <div className={isCentered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] ${isLight ? "text-sage/90" : "text-sage/90"}`}>
        {eyebrow}
      </p>
      <h2 className={`font-[family:var(--font-heading)] text-[2.35rem] leading-[1.02] tracking-[-0.035em] sm:text-[3.35rem] ${isLight ? "text-[#2d3d28]" : ""}`}>
        {title}
      </h2>
      <p className={`mt-4 max-w-xl text-sm leading-7 sm:text-base ${isLight ? "text-bark/82" : "text-bark/82"}`}>
        {description}
      </p>
    </div>
  );
}
