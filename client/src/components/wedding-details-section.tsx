import { useRef } from "react";

export function WeddingDetailsSection() {
  const ref = useRef(null);

  return (
    <section
      id="wedding-details"
      ref={ref}
      className="py-24 sm:py-32 px-6 w-full max-w-full overflow-visible"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-script text-4xl sm:text-5xl text-center text-foreground mb-16 font-light tracking-wide"
          data-testid="text-wedding-details-title"
        >
          Wedding Details
        </h2>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="text-center space-y-6">
            <h3 className="font-serif text-3xl text-primary font-semibold" data-testid="text-ceremony-title">
              Ceremony
            </h3>
            <div className="space-y-3">
              <p className="font-serif text-lg text-foreground" data-testid="text-ceremony-date">
                Saturday, May 2, 2026
              </p>
              <p className="font-serif text-lg text-foreground" data-testid="text-ceremony-time">
                3:00
              </p>
              <p className="font-serif text-lg text-muted-foreground" data-testid="text-ceremony-address">
                Creekside Meadows
                <br />
                9496 Watt Ave
                <br />
                Roseville California
              </p>
              <a
                href="https://maps.google.com/?q=Creekside+Meadows+Roseville+CA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-serif text-primary hover:text-primary/80 transition-colors border-b border-primary pb-1"
                data-testid="link-ceremony-directions"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin w-4 h-4"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Get Directions
              </a>
            </div>
          </div>

          <div className="text-center space-y-6">
            <h3 className="font-serif text-3xl text-primary font-semibold" data-testid="text-reception-title">
              Reception
            </h3>
            <div className="space-y-3">
              <p className="font-serif text-lg text-foreground" data-testid="text-reception-date">
                Saturday, May 2, 2026
              </p>
              <p className="font-serif text-lg text-foreground" data-testid="text-reception-time">
                4:30 PM
              </p>
              <p className="font-serif text-lg text-muted-foreground" data-testid="text-reception-address">
                Creekside Meadows
                <br />
                9496 Watt Ave
                <br />
                Roseville, California
              </p>
              <a
                href="https://maps.google.com/?q=Creekside+Meadows+Roseville+CA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-serif text-primary hover:text-primary/80 transition-colors border-b border-primary pb-1"
                data-testid="link-reception-directions"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin w-4 h-4"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="font-serif text-lg text-muted-foreground italic" data-testid="text-attire">
            Semi-formal attire · Garden reception to follow
          </p>
        </div>
      </div>
    </section>
  );
}
