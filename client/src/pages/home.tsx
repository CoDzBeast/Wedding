import { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { OurStorySection } from "@/components/our-story-section";
import { WeddingDetailsSection } from "@/components/wedding-details-section";
import { ItinerarySection } from "@/components/itinerary-section";
import { RegistrySection } from "@/components/registry-section";
import { LocalStaysSection } from "@/components/local-stays-section";
import { RsvpSection } from "@/components/rsvp-section";

// Add entrance animation styles
import "../styles/home.css";

// Footer component with protective wrapper
const Footer = () => (
  <div className="relative z-30" style={{ zIndex: 30 }}>
    <footer className="bg-primary text-primary-foreground py-8 text-center relative">
      <p className="font-serif text-lg">
        With love, Samantha & Zachary
        <br />
        <span className="text-sm">May 2, 2026</span>
      </p>
    </footer>
  </div>
);

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  // Add state for entrance animation
  const [isLoaded, setIsLoaded] = useState(false);
  // Add state to track if user has interacted with invitation
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Function to enable scrolling after user interaction
    const enableScrolling = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Remove the event listeners after first interaction
        document.removeEventListener('click', enableScrolling);
        document.removeEventListener('keydown', enableScrolling);
        document.removeEventListener('touchstart', enableScrolling);
      }
    };

    // Add event listeners to detect user interaction
    document.addEventListener('click', enableScrolling);
    document.addEventListener('keydown', enableScrolling);
    document.addEventListener('touchstart', enableScrolling);

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
      // Clean up event listeners
      document.removeEventListener('click', enableScrolling);
      document.removeEventListener('keydown', enableScrolling);
      document.removeEventListener('touchstart', enableScrolling);
    };
  }, [hasInteracted]);

  return (
    // Add entrance animation class and conditional scrolling prevention
    <div className={`min-h-screen bg-background w-full max-w-full overflow-x-visible relative ${isLoaded ? 'loaded' : ''} ${!hasInteracted ? 'no-scroll' : ''}`}>
      <Navigation activeSection={activeSection} />
      <HeroSection />
      <div className="content-with-borders">
        <OurStorySection />
        <WeddingDetailsSection />
        <ItinerarySection />
        <RegistrySection />
        <LocalStaysSection />
        <RsvpSection />
      </div>
      <Footer />
    </div>
  );
}