import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { OurStorySection } from "@/components/our-story-section";
import { WeddingDetailsSection } from "@/components/wedding-details-section";
import { ItinerarySection } from "@/components/itinerary-section";
import { RegistrySection } from "@/components/registry-section";
import { LocalStaysSection } from "@/components/local-stays-section";
import { RsvpSection } from "@/components/rsvp-section";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "our-story",
        "wedding-details",
        "itinerary",
        "registry",
        "local-stays",
        "rsvp",
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} />
      <HeroSection />
      <OurStorySection />
      <WeddingDetailsSection />
      <ItinerarySection />
      <RegistrySection />
      <LocalStaysSection />
      <RsvpSection />
    </div>
  );
}
