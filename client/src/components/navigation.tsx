import { useEffect, useState } from "react";

interface NavigationProps {
  activeSection: string;
}

const navLinks = [
  { id: "hero", label: "Home" },
  { id: "our-story", label: "Our Story" },
  { id: "wedding-details", label: "Wedding Details" },
  { id: "itinerary", label: "Itinerary" },
  { id: "registry", label: "Registry" },
  { id: "local-stays", label: "Local Stays" },
  { id: "rsvp", label: "RSVP" },
];

export function Navigation({ activeSection }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 navigation-container ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        } w-full max-w-full overflow-x-visible`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 w-full">
          <div className="hidden md:flex items-center justify-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={closeMobileMenu}
                data-testid={`link-${link.id}`}
                className={`font-serif text-sm tracking-wide transition-all duration-300 relative ${
                  activeSection === link.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary transition-all duration-300" />
                )}
              </a>
            ))}
          </div>

          <div className="md:hidden flex items-center justify-between">
            <a
              href="#hero"
              onClick={closeMobileMenu}
              className="font-script text-2xl text-foreground"
              data-testid="link-home-mobile"
            >
              S & Z
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-2"
              data-testid="button-menu-toggle"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden mobile-menu-overlay">
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={closeMobileMenu}
          />
          <div className="relative h-full flex flex-col items-center justify-center gap-6 z-[10000] mobile-menu-content">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={closeMobileMenu}
                data-testid={`link-${link.id}-mobile`}
                className={`font-serif text-2xl tracking-wide transition-all duration-300 ${
                  activeSection === link.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}