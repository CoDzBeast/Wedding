import { useRef } from "react";

export function RegistrySection() {
  const ref = useRef(null);

  const registryLinks = [
    { name: "Honeyfund", url: "https://www.honeyfund.com/site/tuohy-mcnear-05-02-2026" },
    { name: "Amazon", url: "https://www.amazon.com/wedding/guest-view/1KMB43DB8DEOQ" },
    { name: "Target", url: "https://www.target.com/gift-registry/gift/mcnear-wedding" }
  ];

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

        {/* Registry Links - Simple text buttons */}
        <div className="registry-links-wrapper">
          <div className="registry-links-container">
            {registryLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="registry-link-button"
              >
                {link.name}
              </a>
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