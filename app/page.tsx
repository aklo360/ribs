import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { TourDates } from "@/components/site/tour-dates";
import { Music } from "@/components/site/music";
import { About } from "@/components/site/about";
import { Gallery } from "@/components/site/gallery";
import { Video } from "@/components/site/video";
import { BookingSection } from "@/components/site/booking-section";
import { Footer } from "@/components/site/footer";
import { StickyPlayer } from "@/components/site/sticky-player";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <TourDates />
        <Music />
        <About />
        <Gallery />
        <Video />
        <BookingSection />
      </main>
      <Footer />
      <StickyPlayer />
    </>
  );
}
