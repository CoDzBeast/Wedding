# Wedding Website Project

## Overview

This is a single-page wedding website for Samantha and Zachary's September 14, 2025 celebration in Napa Valley, California. The site features a cinematic, editorial design inspired by high-end wedding publications with a handcrafted, intimate aesthetic. Built as a full-stack application with React frontend and Express backend, it includes sections for the couple's story, wedding details, itinerary, registry, local accommodations, and RSVP functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, bundled using Vite

**Routing**: Wouter for lightweight client-side routing (single-page application)

**UI Component System**: 
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Component library follows the "New York" variant style
- Custom color palette focused on warm neutrals (ivory, sage green, muted gold)

**Typography System**:
- Primary: Serif fonts (Playfair Display, Lora) for body and headers
- Accent: Script fonts (Great Vibes) for couple names and special elements
- Design follows editorial print publication aesthetics

**Animation & Interaction**:
- Framer Motion for scroll-triggered animations and transitions
- Smooth scroll navigation between sections
- Subtle fade-ins and motion effects following cinematic design principles

**State Management**:
- React Query (@tanstack/react-query) for server state management
- React Hook Form with Zod validation for form handling
- Local component state with React hooks

**Design Philosophy**:
- Single-page scroll experience with fixed navigation
- Sections: Hero (with countdown), Our Story, Wedding Details, Itinerary, Registry, Local Stays, RSVP
- Generous whitespace and intentional spacing system based on Tailwind units
- Mobile-first responsive design

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful JSON API with two primary endpoints:
- POST `/api/rsvp` - Create new RSVP submission
- GET `/api/rsvps` - Retrieve all RSVPs

**Request Validation**: Zod schemas for runtime type validation on API requests

**Development Setup**:
- Vite middleware integration for hot module replacement in development
- Custom logging middleware for API request/response tracking
- Static file serving for production builds

**Storage Layer**: 
- Currently using in-memory storage (MemStorage class)
- Interface-based design (IStorage) allows easy migration to persistent database
- Schema defined using Drizzle ORM constructs for future PostgreSQL integration

### Data Schema

**RSVP Model** (defined in shared/schema.ts):
- id: Auto-generated UUID
- name: Guest name (required, min 2 characters)
- email: Valid email address (required)
- attending: Boolean attendance status (required)
- guestCount: Number of guests (1-10, defaults to 1)
- dietaryRestrictions: Optional text field
- message: Optional message to couple

**Validation**:
- Shared Zod schemas between frontend and backend
- Drizzle-Zod integration for type-safe schema definitions
- Client-side validation with React Hook Form
- Server-side validation before data persistence

### Build & Development Workflow

**Development Mode**:
- Vite dev server with HMR for frontend
- tsx for TypeScript execution on backend
- Single command starts both frontend and backend (`npm run dev`)

**Production Build**:
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Separate build steps combined in single command

**Type Safety**:
- Shared types directory for frontend/backend communication
- Path aliases configured (@/ for client, @shared for shared code)
- TypeScript strict mode enabled

## External Dependencies

### UI & Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-built component patterns on top of Radix
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Framer Motion**: Animation library for scroll-based and interactive animations
- **class-variance-authority**: Type-safe component variant management
- **Google Fonts**: Playfair Display, Great Vibes, and Lora for typography

### Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with performance optimization
- **Zod**: Runtime type validation and schema definition
- **Drizzle ORM**: Type-safe database toolkit (prepared for PostgreSQL via @neondatabase/serverless)

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development server

### Backend Infrastructure
- **Express**: Web application framework
- **Wouter**: Lightweight routing for React SPA

### Database (Prepared but not actively used)
- **@neondatabase/serverless**: PostgreSQL client for Neon serverless
- **Drizzle Kit**: Database migration tool
- **connect-pg-simple**: PostgreSQL session store (for future session management)

The application is architected to easily transition from in-memory storage to PostgreSQL by swapping the storage implementation while maintaining the same IStorage interface.