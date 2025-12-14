# GRAFTT Skip Hire Marketplace

## Overview

GRAFTT is a UK-focused skip hire marketplace platform designed to provide a frictionless booking experience comparable to Skyscanner or Uber. The application connects customers with skip hire providers through a multi-step booking flow: Location → Placement → Size → Waste Type → Extra Items → Delivery Date → Providers → Checkout → Confirmation.

The platform operates as an introducing broker, not a direct service provider. All skip hire services are fulfilled by third-party providers displayed in an aggregation view where customers can compare prices, ratings, and certifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/bundling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for global journey state (postcode, placement, size, items, dates, provider selection, customer details, pricing totals)
- **Data Fetching**: TanStack React Query for server state management
- **Forms**: React Hook Form with Zod for validation
- **Animations**: Framer Motion for page transitions and micro-interactions

### UI Component System
- **Design System**: shadcn/ui components (New York style variant)
- **Styling**: Tailwind CSS with custom design tokens defined in CSS variables
- **Typography**: Poppins font family with custom color palette (Teal primary, Navy/Ink text colors)
- **Component Patterns**: Tile-based selection, Chip toggles, Progress Ribbon, Provider Cards with verification badges

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: REST endpoints prefixed with `/api`
- **Development Server**: Vite middleware integration for HMR in development
- **Build Output**: esbuild bundles server to `dist/index.js`, Vite builds client to `dist/public`

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon serverless PostgreSQL (`@neondatabase/serverless`)
- **Schema Location**: `shared/schema.ts` with Zod integration via `drizzle-zod`
- **Storage Abstraction**: `server/storage.ts` provides an interface layer (currently MemStorage implementation)

### Key Design Decisions

1. **Shared Schema Pattern**: Database schema defined in `shared/` directory allows type sharing between client and server, ensuring type safety across the full stack.

2. **Journey Store Pattern**: All booking flow state is centralized in Zustand store (`journeyStore.ts`), enabling persistence across page navigation and easy state inspection.

3. **Provider Data**: Currently mock data in `lib/providers.ts` - designed for easy replacement with API calls. Includes verification status, pricing by skip size, ratings, and environmental metrics.

4. **Pricing Calculation**: Centralized in `lib/pricing.ts` with separate base prices, item surcharges, permit fees, and VAT calculations.

5. **Path Aliases**: TypeScript paths configured for clean imports (`@/` for client/src, `@shared/` for shared, `@assets/` for attached assets).

## External Dependencies

### Third-Party Services
- **Payments**: Stripe (React Stripe.js + Stripe.js) configured for Payment Element and Apple/Google Pay
- **Maps**: Leaflet for location selection with draggable pin functionality
- **Database**: Neon serverless PostgreSQL

### Key NPM Packages
- **UI Primitives**: Full Radix UI component suite (dialog, dropdown, tabs, tooltip, etc.)
- **Date Handling**: date-fns for date formatting and manipulation
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Animation**: Framer Motion for transitions, potential Lottie integration for success states

### Development Tools
- **Replit Plugins**: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner for enhanced Replit development experience
- **Database Migrations**: drizzle-kit for schema push (`npm run db:push`)