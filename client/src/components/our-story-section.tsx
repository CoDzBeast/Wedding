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
      className="py-24 sm:py-32 px-6 overflow-visible"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="font-script text-4xl sm:text-5xl text-center text-foreground mb-16 font-light tracking-wide"
            data-testid="text-our-story-title"
          >
            Our Story
          </h2>

          <div className="space-y-12 font-sans text-lg leading-relaxed text-foreground/85">
            {/* Paragraph 1 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="text-story-paragraph-1"
            >
              Our story began about ten years ago. Zach was a sophomore in high
              school, and Sam was a freshman. After the local county fair, a few
              of Zachary’s friends met up with Sam and her friends, and that
              small moment became the start of something none of us could have
              predicted.
            </motion.p>

            <div className="flex justify-center">
              <div className="w-24 h-1 bg-border" />
            </div>

            {/* Paragraph 2 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              data-testid="text-story-paragraph-2"
            >
              Before long, our friend group was hanging out every weekend. At
              that time, none of us realized our paths would end up shaping the
              rest of our lives. We were simply friends spending time together,
              laughing, talking, and growing up without knowing what the future
              held.
            </motion.p>

            <div className="flex justify-center">
              <div className="w-24 h-1 bg-border" />
            </div>

            {/* Paragraph 3 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              data-testid="text-story-paragraph-3"
            >
              As the years passed, the group slowly drifted apart, but we stayed
              connected. Even when we didn’t see each other as often as we
              wanted, we never lost touch. We always knew what the other person
              was going through. Eventually something shifted—our conversations
              became deeper, our laughs came easier, and we began to realize how
              much we truly had in common. Over the next few months, it became
              clear that what we had was more than friendship. It was something
              real, and something worth holding onto.
            </motion.p>

            <div className="flex justify-center">
              <div className="w-24 h-1 bg-border" />
            </div>

            {/* Paragraph 4 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.55 }}
              data-testid="text-story-paragraph-4"
            >
              Once we understood that, everything started to fall into place.
              Sam had always lived on her own and Zachary was still at home with
              his parents, so we spent our time going back and forth between the
              two houses. To make life easier—and to stop packing overnight bags
              every night—Sam decided to move into Zachary’s house. It was
              exciting and new, and while living with parents had its
              challenges, being together made it worth it.
            </motion.p>

            <div className="flex justify-center">
              <div className="w-24 h-1 bg-border" />
            </div>

            {/* Paragraph 5 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.65 }}
              data-testid="text-story-paragraph-5"
            >
              By February 2025, we finally had a home of our own. It felt good
              to build a place that was truly ours—a place where we could settle
              in and start building the life we always wanted together.
            </motion.p>

            <div className="flex justify-center">
              <div className="w-24 h-1 bg-border" />
            </div>

            {/* Paragraph 6 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.75 }}
              data-testid="text-story-paragraph-6"
            >
              Later in (insert month), Zachary got down on one knee and asked
              Samantha to marry him. After a moment of shock and excitement, she
              said yes.
            </motion.p>

            <div className="flex justify-center">
              <div className="w-24 h-1 bg-border" />
            </div>

            {/* Paragraph 7 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.85 }}
              data-testid="text-story-paragraph-7"
            >
              This is only the beginning of our story, and now we get to write
              the rest together.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
