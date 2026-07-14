import type { Metadata } from "next";
import { SiteNav } from "@/components/site/nav";
import { BookingSection } from "@/components/site/booking-section";
import { Footer } from "@/components/site/footer";
import { SITE } from "@/lib/content";

const metadataTitle = `${SITE.name} · ${SITE.tagline}`;

export const metadata: Metadata = {
  title: {
    absolute: metadataTitle,
  },
  description:
    "Book Roots in Blue Stone for festivals, weddings, wineries, and private events, from duo to full festival band.",
  openGraph: {
    title: metadataTitle,
  },
  twitter: {
    title: metadataTitle,
  },
};

export default function BookPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-16">
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
