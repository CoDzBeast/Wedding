import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { OurStorySection } from "@/components/our-story-section";
import { WeddingDetailsSection } from "@/components/wedding-details-section";
import { ItinerarySection } from "@/components/itinerary-section";
import { RegistrySection } from "@/components/registry-section";
import { LocalStaysSection } from "@/components/local-stays-section";
import { RsvpSection } from "@/components/rsvp-section";

// Divider components with decorative floral elements
const DividerA = () => (
  <div className="section-divider divider-a relative h-0 my-0">
    <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 opacity-60 rotate-45 transform origin-center">
      <img 
        src="/4F84008B-85FE-4915-AA1C-55C2D45CF9AE.png"
        alt="Decorative border element"
        className="w-auto h-auto max-w-none"
        style={{
          display: 'block',
          maxWidth: '200px',
          maxHeight: '200px'
        }}
      />
    </div>
  </div>
);

const DividerB = () => (
  <div className="section-divider divider-b relative h-0 my-0">
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-60 -rotate-45 transform origin-center">
      <img 
        src="/4F84008B-85FE-4915-AA1C-55C2D45CF9AE.png"
        alt="Decorative border element"
        className="w-auto h-auto max-w-none"
        style={{
          display: 'block',
          maxWidth: '200px',
          maxHeight: '200px'
        }}
      />
    </div>
  </div>
);

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
    <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden relative">
      <Navigation activeSection={activeSection} />
      <HeroSection />
      <OurStorySection />
      <DividerB />
      <WeddingDetailsSection />
      <DividerA />
      <ItinerarySection />
      <DividerB />
      <RegistrySection />
      <DividerA />
      <LocalStaysSection />
      <DividerB />
      <RsvpSection />
    </div>
  );
}
