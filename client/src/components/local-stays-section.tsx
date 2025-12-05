import { useRef } from "react";

const hotels = [
  {
    name: "Hyatt Place Sacramento/Roseville",
    distance: "9 miles from venue",
    description: "Comfortable, modern hotel in Roseville near Sacramento · Easy access to shopping and freeways",
    bookingUrl: "https://www.hyatt.com/hyatt-place/en-US/saczv-hyatt-place-sacramento-roseville/",
  },
  {
    name: "Residence Inn by Marriott Rocklin Roseville",
    distance: "9 miles from venue",
    description: "Comfortable, all-suite lodging in Roseville / Rocklin · Spacious rooms with full kitchens, free breakfast & easy freeway access",
    bookingUrl: "https://www.marriott.com/en-us/hotels/sacov-residence-inn-rocklin-roseville/overview/",
  },

];

export function LocalStaysSection() {
  const ref = useRef(null);

  return (
    <section
      id="local-stays"
      ref={ref}
      className="py-24 sm:py-32 px-6 overflow-visible"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-script text-4xl sm:text-5xl text-center text-foreground mb-8 font-light tracking-wide"
          data-testid="text-local-stays-title"
        >
          Local Stays
        </h2>

        <p
          className="font-sans text-lg text-center text-muted-foreground mb-16 leading-relaxed"
          data-testid="text-local-stays-message"
        >
          We've curated a selection of accommodations near our venue to make
          your stay as comfortable as possible.
        </p>

        <div className="space-y-12">
          {hotels.map((hotel, index) => (
            <div
              key={index}
              className="border-b-2 border-border pb-12 last:border-b-0 last:pb-0"
              data-testid={`hotel-item-${index}`}
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <h3 className="font-serif text-2xl text-foreground" data-testid={`text-hotel-name-${index}`}>
                    {hotel.name}
                  </h3>
                  <span className="font-sans text-sm text-primary" data-testid={`text-hotel-distance-${index}`}>
                    {hotel.distance}
                  </span>
                </div>
                <p className="font-sans text-base text-muted-foreground leading-relaxed" data-testid={`text-hotel-description-${index}`}>
                  {hotel.description}
                </p>
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-sans text-base text-primary hover:text-primary/80 transition-colors duration-300 underline underline-offset-4"
                  data-testid={`link-hotel-booking-${index}`}
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}