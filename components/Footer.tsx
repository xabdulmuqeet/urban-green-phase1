import Link from "next/link";

const catalogueLinks = [
  { href: "/shop", label: "Indoor Plants" },
  { href: "/bundle", label: "Rare Species" },
  { href: "/care-guide", label: "Care Kits" }
];

const aboutLinks = [
  { href: "/bundle", label: "Sustainability" },
  { href: "/cart", label: "Shipping" },
  { href: "/care-guide", label: "Journal" }
];

export function Footer() {
  return (
    <footer className="w-full bg-[#ecefea] px-[80px] py-16">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 md:grid-cols-4">
        <div>
          <div className="mb-6 font-[family:var(--font-heading)] text-xl italic text-[#486730]">
            The Urban Green
          </div>
          <p className="font-[family:var(--font-body)] text-xs leading-relaxed tracking-[0.18em] text-[#516448]/80">
            Dedicated to the art of botanical preservation and urban greening.
          </p>
        </div>

        <div>
          <h5 className="mb-6 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.22em] text-[#486730]">
            Catalogue
          </h5>
          <ul className="flex flex-col gap-4 font-[family:var(--font-body)] text-xs uppercase tracking-[0.18em] text-[#516448]">
            {catalogueLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="opacity-80 transition-opacity hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-6 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.22em] text-[#486730]">
            About
          </h5>
          <ul className="flex flex-col gap-4 font-[family:var(--font-body)] text-xs uppercase tracking-[0.18em] text-[#516448]">
            {aboutLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="opacity-80 transition-opacity hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-6 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.22em] text-[#486730]">
            Newsletter
          </h5>
          <p className="mb-4 font-[family:var(--font-body)] text-xs text-[#486730]/60">
            Join our botanical community for rare plant drops.
          </p>
          <div className="flex border-b border-[#486730]/20 pb-2">
            <span className="w-full bg-transparent font-[family:var(--font-body)] text-xs text-[#516448]/60">
              Email Address
            </span>
            <a
              href="mailto:hello@theurbangreen.store?subject=Join%20The%20Green%20Club"
              aria-label="Join newsletter"
              className="flex items-center text-[#486730]"
            >
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-screen-2xl border-t border-[#486730]/5 pt-8 text-center">
        <p className="font-[family:var(--font-body)] text-xs uppercase tracking-[0.22em] text-[#486730]/40">
          © 2024 The Urban Green. Crafted for the Botanical Archivist.
        </p>
      </div>
    </footer>
  );
}
