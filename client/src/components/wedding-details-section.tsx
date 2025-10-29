import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function WeddingDetailsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="wedding-details"
      ref={ref}
      className="py-24 sm:py-32 px-6 bg-card"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl text-center text-foreground mb-16 font-light tracking-wide"
          data-testid="text-wedding-details-title"
        >
          Wedding Details
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h3
              className="font-serif text-2xl text-foreground mb-6 font-medium"
              data-testid="text-ceremony-title"
            >
              Ceremony
            </h3>
            <div className="space-y-3 font-sans text-lg text-foreground/80">
              <p data-testid="text-ceremony-time">4:00 PM</p>
              <p data-testid="text-ceremony-venue">Meadowood Estate</p>
              <p className="text-base text-muted-foreground" data-testid="text-ceremony-address">
                900 Meadowood Lane
                <br />
                St. Helena, CA 94574
              </p>
              <a
                href="https://maps.google.com/?q=Meadowood+Estate+St+Helena+CA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-primary hover:text-primary/80 transition-colors duration-300 text-base underline underline-offset-4"
                data-testid="link-ceremony-directions"
              >
                Get Directions
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center md:text-left"
          >
            <h3
              className="font-serif text-2xl text-foreground mb-6 font-medium"
              data-testid="text-reception-title"
            >
              Reception
            </h3>
            <div className="space-y-3 font-sans text-lg text-foreground/80">
              <p data-testid="text-reception-time">6:00 PM</p>
              <p data-testid="text-reception-venue">The Hillside Terrace</p>
              <p className="text-base text-muted-foreground" data-testid="text-reception-address">
                900 Meadowood Lane
                <br />
                St. Helena, CA 94574
              </p>
              <a
                href="https://maps.google.com/?q=Meadowood+Estate+St+Helena+CA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-primary hover:text-primary/80 transition-colors duration-300 text-base underline underline-offset-4"
                data-testid="link-reception-directions"
              >
                Get Directions
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="font-serif text-lg text-muted-foreground italic" data-testid="text-attire">
            Semi-formal attire · Garden reception to follow
          </p>
        </motion.div>
      </div>
    </section>
  );
}
