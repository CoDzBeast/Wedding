import { useRef } from "react";

const registries = [
  {
    name: "Williams Sonoma",
    url: "https://www.williams-sonoma.com/registry/",
    description: "For our kitchen and home essentials",
  },
  {
    name: "Crate & Barrel",
    url: "https://www.crateandbarrel.com/gift-registry/",
    description: "Home furnishings and décor",
  },
  {
    name: "Honeyfund",
    url: "https://www.honeyfund.com/",
    description: "Contributions to our honeymoon adventure",
  },
];

export function RegistrySection() {
  const ref = useRef(null);

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

        <div className="space-y-8">
          {registries.map((registry, index) => (
            <div
              key={index}
              className="text-center"
            >
              <a
                href={registry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block"
                data-testid={`link-registry-${index}`}
              >
                <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {registry.name}
                </h3>
                <p className="font-sans text-base text-muted-foreground">
                  {registry.description}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}