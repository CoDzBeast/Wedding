import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function OurStorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="our-story"
      ref={ref}
      className="py-24 sm:py-32 px-6 bg-background"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="font-serif text-4xl sm:text-5xl text-center text-foreground mb-16 font-light tracking-wide"
            data-testid="text-our-story-title"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Our Story
          </h2>

          <div className="space-y-12 font-sans text-lg leading-relaxed text-foreground/85">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="text-story-paragraph-1"
            >
              We met on a rainy October evening in a small bookshop in San
              Francisco. Emily was searching for a first edition of her
              favorite novel, and James happened to be holding the last copy.
              What started as a conversation about literature turned into hours
              of talking over coffee at the café next door.
            </motion.p>

            <div className="flex justify-center">
              <div className="w-24 h-px bg-border" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              data-testid="text-story-paragraph-2"
            >
              Over the next few years, we explored the world together—from the
              cobblestone streets of Paris to the quiet beaches of Big Sur. We
              learned that home isn't a place, but the feeling of being with
              someone who truly understands you. Through every adventure, quiet
              moment, and challenge we've faced, our love has only grown
              stronger.
            </motion.p>

            <div className="flex justify-center">
              <div className="w-24 h-px bg-border" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              data-testid="text-story-paragraph-3"
            >
              On a spring evening in Napa Valley, surrounded by rolling
              vineyards and golden light, James asked Emily to spend forever
              with him. She said yes without hesitation. Now, we're returning to
              that same beautiful valley to celebrate our love with the people
              who mean the most to us.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}