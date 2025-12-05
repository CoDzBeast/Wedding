import { useEffect, useState } from "react";

export default function RegistryCard({ url, image: manualImage, price }: { url: string; image: string; price: number }) {
  const [title, setTitle] = useState("Loading…");
  const [autoImage, setAutoImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const res = await fetch(
          `https://api.microlink.io/?url=${encodeURIComponent(
            url
          )}&meta=true&audio=false&video=false&screenshot=false`
        );

        const json = await res.json();
        const data = json.data || {};

        // Auto Title
        setTitle(data.title || "Product");

        // Auto Image Primary
        let fetched = data.image?.url;

        // Prevent favicon/icon images
        if (
          !fetched ||
          fetched.includes("favicon") ||
          fetched.endsWith(".ico") ||
          fetched.endsWith(".svg")
        ) {
          fetched = null;
        }

        // Fallback for Amazon (Discord behavior)
        if (!fetched) {
          const links = data.links || [];
          const amazonImages = links
            .map((l: any) => l.href)
            .filter(
              (href: string) =>
                typeof href === "string" &&
                href.includes("m.media-amazon.com/images/I/")
            );

          if (amazonImages.length > 0) {
            fetched = amazonImages.sort((a: string, b: string) => b.length - a.length)[0];
          }
        }

        // Store auto image
        setAutoImage(fetched || null);

      } catch (e) {
        console.error("Microlink error:", e);
        setTitle("Product");
      }
    }

    loadMetadata();
  }, [url]);

  // ALWAYS use manual image if provided and non-empty
  const finalImage = manualImage && manualImage.trim() !== "" 
    ? manualImage 
    : autoImage;

  return (
    <a className="registry-card" href={url} target="_blank" rel="noopener noreferrer">
      <div className="registry-img-wrapper">
        <img src={finalImage || ""} alt={title} className="registry-img" />
      </div>

      <h4 className="registry-name">{title}</h4>

      <div className="registry-price">${price.toFixed(2)}</div>

      <button className="view-btn">View Product</button>
    </a>
  );
}