import type { Metadata } from "next";
import { SiteNav } from "@/components/site/nav";
import { BookingSection } from "@/components/site/booking-section";
import { Footer } from "@/components/site/footer";

export const metadata: Metadata = {
  title: "Book the Band",
  description:
    "Book Roots in Blue Stone for festivals, weddings, wineries, and private events — duo to full festival band.",
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
