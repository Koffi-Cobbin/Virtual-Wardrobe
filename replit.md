# DrapeRoom - Virtual Fitting Room

## Overview

DrapeRoom is a 3D virtual fitting room application that allows users to try on wearables in an interactive 3D environment. Users can upload custom 3D avatar models (GLB format) and wearable items, then visualize and manipulate them in real-time using Three.js rendering.

The application features a React-based frontend with a 3D scene viewer, allowing users to load, position, rotate, and merge 3D models together. It includes a landing page and a main fitting room experience with an intuitive interface for managing avatars and wearable items.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for global application state (avatar URLs, loaded wearables, camera controls, merge states)
- **3D Rendering**: Three.js with React Three Fiber and React Three Drei for declarative 3D scene management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom theme variables (dark mode, amber accent colors)
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: Vite dev server integration with HMR support
- **Production**: Static file serving from built client assets

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Basic user authentication schema (users table with id, username, password)
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Database**: PostgreSQL (requires DATABASE_URL environment variable)

### Key Design Patterns
- **Component-Based Architecture**: UI split into scene components (3D rendering) and interface components (controls/panels)
- **State Centralization**: All 3D object transforms, visibility, and selection managed through Zustand store
- **File Handling**: GLB model validation and loading through Three.js GLTFLoader
- **Geometry Merging**: BufferGeometryUtils for combining multiple 3D models

### Project Structure
```
client/           # Frontend React application
  src/
    components/   # UI and 3D scene components
    pages/        # Route pages (Home, Landing, NotFound)
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
    store.ts      # Zustand state management
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Data access layer
  static.ts       # Static file serving
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
```

## External Dependencies

### Third-Party Services
- **PostgreSQL**: Primary database (requires DATABASE_URL)
- **Google Fonts**: Inter and Rajdhani font families

### Key Libraries
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber (OrbitControls, Environment, TransformControls)
- **three**: Core 3D graphics library with GLTFLoader for model loading
- **drizzle-orm**: TypeScript ORM for database operations
- **@tanstack/react-query**: Server state management
- **zod**: Schema validation
- **sonner**: Toast notifications

### Build Dependencies
- **Vite**: Development server and production bundler
- **esbuild**: Server-side TypeScript bundling
- **Tailwind CSS**: Utility-first CSS framework