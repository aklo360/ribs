import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { TourDates } from "@/components/site/tour-dates";
import { Music } from "@/components/site/music";
import { About } from "@/components/site/about";
import { Gallery } from "@/components/site/gallery";
import { Video } from "@/components/site/video";
import { BookingSection } from "@/components/site/booking-section";
import { Newsletter } from "@/components/site/newsletter";
import { Footer } from "@/components/site/footer";
import { StickyPlayer } from "@/components/site/sticky-player";
import { PlayerProvider } from "@/components/site/player-provider";

export default function Home() {
  return (
    <PlayerProvider>
      <SiteNav />
      <main>
        <Hero />
        <TourDates />
        <Music />
        <About />
        <Gallery />
        <Video />
        <BookingSection />
        <Newsletter />
      </main>
      <Footer />
      <StickyPlayer />
    </PlayerProvider>
  );
}
