import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRsvpSchema } from "@shared/schema";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/rsvp", async (req, res) => {
    try {
      const validatedData = insertRsvpSchema.parse(req.body);
      const rsvp = await storage.createRsvp(validatedData);
      res.json(rsvp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        console.error("Error creating RSVP:", error);
        res.status(500).json({ error: "Failed to create RSVP" });
      }
    }
  });

  app.get("/api/rsvps", async (_req, res) => {
    try {
      const rsvps = await storage.getRsvps();
      res.json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({ error: "Failed to fetch RSVPs" });
    }
  });

  app.get("/api/meta", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "URL is required" });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: "Invalid URL format" });
      }

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      });

      const $ = cheerio.load(response.data);
      
      // Extract Open Graph metadata
      const metadata: any = {};
      
      // Get title
      metadata.title = $('meta[property="og:title"]').attr('content') || 
                      $('meta[name="twitter:title"]').attr('content') ||
                      $('title').first().text() ||
                      null;
      
      // Get image
      metadata.image = $('meta[property="og:image"]').attr('content') ||
                      $('meta[name="twitter:image"]').attr('content') ||
                      null;
      
      // Get price
      metadata.price = $('meta[property="product:price:amount"]').attr('content') ||
                      null;
      
      // Fallbacks for title and image if OG not found
      if (!metadata.title) {
        metadata.title = $('meta[name="title"]').attr('content') || null;
      }
      
      if (!metadata.image) {
        metadata.image = $('meta[name="image"]').attr('content') || null;
      }

      res.json(metadata);
    } catch (error: any) {
      console.error("Error fetching metadata:", error.message);
      // Return default metadata instead of failing completely
      res.json({
        title: "Product",
        image: null,
        price: null
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}