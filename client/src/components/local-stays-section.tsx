import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const hotels = [
  {
    name: "Meadowood Napa Valley",
    distance: "On-site",
    description: "Our wedding venue · Luxury accommodations · Book early for best availability",
    bookingUrl: "https://www.meadowood.com/",
  },
  {
    name: "Auberge du Soleil",
    distance: "3 miles from venue",
    description: "Hillside resort with vineyard views · Fine dining · Spa amenities",
    bookingUrl: "https://aubergedusoleil.aubergeresorts.com/",
  },
  {
    name: "Harvest Inn",
    distance: "2 miles from venue",
    description: "Historic estate · Family-friendly · Complimentary breakfast",
    bookingUrl: "https://www.harvestinn.com/",
  },
  {
    name: "Hotel St. Helena",
    distance: "4 miles from venue",
    description: "Boutique hotel in downtown St. Helena · Walking distance to restaurants and shops",
    bookingUrl: "https://www.hotelsthelena.com/",
  },
];

export function LocalStaysSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="local-stays"
      ref={ref}
      className="py-24 sm:py-32 px-6 bg-background"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl text-center text-foreground mb-8 font-light tracking-wide"
          data-testid="text-local-stays-title"
        >
          Local Stays
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-lg text-center text-muted-foreground mb-16 leading-relaxed"
          data-testid="text-local-stays-message"
        >
          We've curated a selection of accommodations near our venue to make
          your stay as comfortable as possible.
        </motion.p>

        <div className="space-y-12">
          {hotels.map((hotel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="border-b border-border pb-12 last:border-b-0 last:pb-0"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
