import { useRef } from "react";

const timelineEvents = [
  { time: "3:00 PM", title: "Guests Arrive", description: "Welcome reception with light refreshments" },
  { time: "3:30 PM", title: "Ceremony Begins", description: "Join us as we exchange our vows" },
  { time: "4:00 PM", title: "Cocktail Hour", description: "Champagne and hors d'oeuvres on the terrace" },
  { time: "5:00 PM", title: "Reception & Dinner", description: "A celebration feast under the stars" },
  { time: "7:00 PM", title: "First Dance", description: "The newlyweds take the floor" },
  { time: "7:30 PM", title: "Dancing & Celebration", description: "Dance the night away with us" },
  { time: "9:30 PM", title: "Send-Off", description: "A magical farewell under the night sky" },
];

export function ItinerarySection() {
  const ref = useRef(null);

  return (
    <section
      id="itinerary"
      ref={ref}
      className="py-24 sm:py-32 px-6 overflow-visible"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-script text-4xl sm:text-5xl text-center text-foreground mb-16 font-light tracking-wide"
          data-testid="text-itinerary-title"
        >
          Itinerary
        </h2>

        <div className="space-y-0">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className="relative pb-12 last:pb-0"
              data-testid={`itinerary-item-${index}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8">
                <div className="font-serif text-lg sm:text-xl text-primary font-medium whitespace-nowrap min-w-[100px]" data-testid={`text-time-${index}`}>
                  {event.time}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-2" data-testid={`text-event-title-${index}`}>
                    {event.title}
                  </h3>
                  <p className="font-sans text-base text-muted-foreground leading-relaxed" data-testid={`text-event-description-${index}`}>
                    {event.description}
                  </p>
                </div>
              </div>
              {index < timelineEvents.length - 1 && (
                <div className="absolute left-0 sm:left-[100px] bottom-0 w-px h-12 bg-border/50 ml-12 sm:ml-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}