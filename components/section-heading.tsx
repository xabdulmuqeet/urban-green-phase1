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
      <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.3em] ${isLight ? "text-[#87A96B]" : "text-sage"}`}>
        {eyebrow}
      </p>
      <h2 className={`font-[family:var(--font-heading)] text-4xl leading-tight sm:text-5xl ${isLight ? "text-[#243020]" : ""}`}>
        {title}
      </h2>
      <p className={`mt-4 text-sm leading-7 sm:text-base ${isLight ? "text-[#7D746C]" : "text-bark/80"}`}>
        {description}
      </p>
    </div>
  );
}
