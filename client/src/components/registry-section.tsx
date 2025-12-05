import { useRef, useState, useEffect } from "react";
import registryData from "../registry/registry.json";
import RegistryCard from "./RegistryCard";

export function RegistrySection() {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobilePage, setMobilePage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(registryData.length / itemsPerPage);

  const start = mobilePage * itemsPerPage;
  const end = start + itemsPerPage;
  const pagedItems = registryData.slice(start, end);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  return (
    <section
      id="registry"
      ref={ref}
      className="py-24 sm:py-32 px-6 overflow-visible"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-script text-4xl sm:text-5xl text-center text-foreground mb-8 font-light tracking-wide"
          data-testid="text-registry-title"
        >
          Registry
        </h2>

        <p
          className="font-sans text-lg text-center text-muted-foreground mb-16 leading-relaxed"
          data-testid="text-registry-message"
        >
          Your presence at our wedding is the greatest gift of all. However, if
          you wish to honor us with a gift, we've registered at the following
          locations.
        </p>

        {/* Desktop view wrapper (unchanged) */}
        <div className="desktop-only">
          <div className="registry-carousel-wrapper">
            <button className="registry-arrow left" onClick={scrollLeft}>‹</button>

            <div ref={scrollRef} className="registry-scroll-area">
              {registryData.map((item, index) => (
                <div className="registry-item" key={index}>
                  <RegistryCard
                    url={item.url}
                    image={item.image}
                    price={item.price}
                  />
                </div>
              ))}
            </div>

            <button className="registry-arrow right" onClick={scrollRight}>›</button>
          </div>
        </div>

        {/* Mobile view wrapper - SHOW FIRST 6 ITEMS ONLY */}
        <div className="mobile-only">
          <div className="registry-mobile-grid">
            {registryData.slice(0, 6).map((item, idx) => (
              <div className="registry-card" key={idx}>
                <RegistryCard
                  url={item.url}
                  image={item.image}
                  price={item.price}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Venmo Subsection */}
        <div className="registry-venmo-wrapper">
          <h2 className="registry-venmo-title">Gift Any Amount</h2>
          <p className="registry-venmo-subtitle">Contribute to our Journey!</p>

          <div className="registry-venmo-grid">
            {/* Venmo QR */}
            <div className="registry-venmo-card">
              <img src="assets/venmo-qr.png" alt="Venmo QR Code" className="registry-venmo-qr" />
              <div className="registry-venmo-username">Zachary_McNear</div>
            </div>

            {/* PayPal QR */}
            <div className="registry-venmo-card">
              <img src="assets/paypal-qr.png" alt="PayPal QR Code" className="registry-venmo-qr" />
              <div className="registry-venmo-username">@ZacharyMcNear</div>
            </div>

            {/* CashApp QR */}
            <div className="registry-venmo-card">
              <img src="assets/cashapp-qr.png" alt="CashApp QR Code" className="registry-venmo-qr" />
              <div className="registry-venmo-username">$zmcnear</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}