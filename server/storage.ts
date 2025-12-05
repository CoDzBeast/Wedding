import { type Rsvp, type InsertRsvp } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  getRsvps(): Promise<Rsvp[]>;
  getRsvpById(id: string): Promise<Rsvp | undefined>;
}

export class MemStorage implements IStorage {
  private rsvps: Map<string, Rsvp>;

  constructor() {
    this.rsvps = new Map();
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const id = randomUUID();
    const rsvp: Rsvp = { 
      ...insertRsvp, 
      id,
      dietaryRestrictions: insertRsvp.dietaryRestrictions || "",
      message: insertRsvp.message || "",
    };
    this.rsvps.set(id, rsvp);
    return rsvp;
  }

  async getRsvps(): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values());
  }

  async getRsvpById(id: string): Promise<Rsvp | undefined> {
    return this.rsvps.get(id);
  }
}

export const storage = new MemStorage();
