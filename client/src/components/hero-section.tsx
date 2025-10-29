import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/Cinematic_golden_hour_landscape_background_8a331fd2.png";

export function HeroSection() {
  const weddingDate = new Date("2025-09-14T16:00:00");
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60 z-10" />
        <img
          src={heroImage}
          alt="Wedding venue"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-script text-6xl sm:text-7xl md:text-8xl text-foreground mb-8"
          data-testid="text-couple-names"
        >
          Emily & James
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-8"
        >
          <div
            className="flex items-center justify-center gap-3 text-foreground/90 font-serif text-lg sm:text-xl mb-4"
            data-testid="text-countdown"
          >
            <span className="font-medium">{timeRemaining.days}</span>
            <span className="text-sm text-muted-foreground">days</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-medium">{timeRemaining.hours}</span>
            <span className="text-sm text-muted-foreground">hours</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-medium">{timeRemaining.minutes}</span>
            <span className="text-sm text-muted-foreground">minutes</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="font-serif text-base sm:text-lg text-muted-foreground"
        >
          <p className="mb-2" data-testid="text-wedding-date">
            September 14, 2025
          </p>
          <p data-testid="text-wedding-location">Napa Valley, California</p>
        </motion.div>
      </div>
    </section>
  );
}
