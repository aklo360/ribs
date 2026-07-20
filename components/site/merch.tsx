import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { SmartImage } from "./smart-image";
import { MERCH_PRODUCTS } from "@/lib/merch";

export function Merch() {
  return (
    <Section id="merch" eyebrow="Official Merch">
      <div className="grid gap-4 md:grid-cols-3">
        {MERCH_PRODUCTS.map((product, index) => (
          <Reveal key={product.id} delay={index * 0.07}>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Shop ${product.name} on the RIBS Printful store`}
              className="group block overflow-hidden rounded-[6px] border border-white/10 bg-[#101011] transition-colors duration-300 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <div className="relative aspect-square overflow-hidden bg-[#eeeeec]">
                <SmartImage
                  src={product.image}
                  alt={product.name}
                  label={product.name}
                  seed={index}
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
                <div className="absolute left-3 top-3 grid size-9 place-items-center rounded-full border border-black/10 bg-black/80 text-white shadow-lg backdrop-blur-sm">
                  <ShoppingBag className="size-4" aria-hidden />
                </div>
              </div>

              <div className="flex min-h-28 items-end justify-between gap-5 p-5">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold leading-tight">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/48">
                    {product.detail}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="font-mono text-sm font-semibold tabular-nums text-foreground/88">
                    {product.price}
                  </p>
                  <ArrowUpRight
                    className="size-4 text-foreground/50 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden
                  />
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
