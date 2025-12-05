import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/Cinematic_golden_hour_landscape_background_8a331fd2.png";

export function HeroSection() {
  const weddingDate = new Date("2026-05-02T16:00:00");
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
      className="relative h-screen flex items-center justify-center overflow-visible w-full max-w-full"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60 z-22" />
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
          Samantha and Zachary
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-8"
        >
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-6xl font-serif text-foreground font-semibold mb-2">
                {String(timeRemaining.days).padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base font-serif text-foreground uppercase tracking-wider">
                Days
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-6xl font-serif text-foreground font-semibold mb-2">
                {String(timeRemaining.hours).padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base font-serif text-foreground uppercase tracking-wider">
                Hours
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-6xl font-serif text-foreground font-semibold mb-2">
                {String(timeRemaining.minutes).padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base font-serif text-foreground uppercase tracking-wider">
                Minutes
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-6xl font-serif text-foreground font-semibold mb-2">
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base font-serif text-foreground uppercase tracking-wider">
                Seconds
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="font-serif text-lg sm:text-xl md:text-2xl text-foreground font-semibold"
        >
          <p className="mb-2" data-testid="text-wedding-date">
            May 2, 2026
          </p>
          <p data-testid="text-wedding-location">Roseville, California</p>
        </motion.div>
      </div>
    </section>
  );
}