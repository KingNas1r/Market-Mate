# SmartStock Inventory Management System

## Overview

SmartStock is a full-stack inventory management application built with a modern tech stack. The application provides a comprehensive solution for managing products, tracking sales, and monitoring business metrics through an intuitive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.
Target market: Nigerian small businesses
Currency: Nigerian Naira (₦)
Languages supported: English, Yoruba, Nigerian Pidgin
Voice input: Required for accessibility and ease of use

## System Architecture

### Frontend Architecture
The client is built with React and TypeScript, utilizing a component-based architecture with the following key decisions:

- **React with TypeScript**: Provides type safety and better developer experience
- **Wouter for Routing**: Lightweight alternative to React Router for client-side navigation
- **TanStack Query**: Handles server state management, caching, and data synchronization
- **shadcn/ui Components**: Modern, accessible UI component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid styling with custom design tokens

### Backend Architecture
The server follows a RESTful API pattern with Express.js:

- **Express.js**: Minimal and flexible Node.js web framework
- **TypeScript**: Type-safe server-side development
- **Modular Route Structure**: Organized API endpoints in separate route handlers
- **Memory Storage with Interface**: In-memory data storage with a clean interface pattern that allows easy migration to persistent storage

### Database Strategy
Now uses PostgreSQL database with Drizzle ORM:

- **Storage Interface**: Abstract storage layer (`IStorage`) that defines all data operations
- **Database Implementation**: Production-ready PostgreSQL storage with Drizzle ORM
- **Schema Definition**: Comprehensive database schema with proper relationships and constraints
- **Sample Data**: Automatic initialization with sample products on first run
- **Schema Definition**: Comprehensive database schema using Drizzle ORM with proper relationships

## Key Components

### Data Models
- **Products**: Core inventory items with stock tracking and low-stock alerts
- **Sales**: Transaction records linked to products with payment information
- **Dashboard Analytics**: Computed metrics for business insights

### Frontend Pages
- **Dashboard**: Overview with key metrics and recent activity
- **Inventory**: Product management with CRUD operations and filtering
- **Sales**: Transaction processing and sales history
- **404 Handler**: Graceful error handling for unknown routes

### UI Components
- **Layout Components**: Header with branding and sidebar navigation
- **Modal Components**: Product creation/editing and sales processing forms
- **shadcn/ui Library**: Complete set of accessible, styled components

## Data Flow

### Client-Server Communication
1. **API Requests**: Centralized through `queryClient` with automatic error handling
2. **State Management**: TanStack Query manages server state with automatic caching
3. **Real-time Updates**: Optimistic updates with automatic cache invalidation
4. **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Data Processing
1. **Input Validation**: Schema validation using Zod on both client and server
2. **Error Handling**: Comprehensive error boundaries and user-friendly error messages
3. **Data Transformation**: Type-safe data transformations with TypeScript interfaces

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, TypeScript, Vite for development and building
- **UI Framework**: Radix UI primitives with shadcn/ui styling
- **State Management**: TanStack Query for server state
- **Database**: Drizzle ORM with PostgreSQL dialect (configured but not yet connected)

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Database Migrations**: Drizzle Kit for schema management
- **Styling**: Tailwind CSS with PostCSS processing
- **Development Experience**: Replit-specific plugins for enhanced development workflow

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Single Command Deploy**: Combined build process creates complete deployable application

### Environment Configuration
- **Development**: Live reload with Vite dev server and Express backend
- **Production**: Static file serving with Express handling both API and frontend routes
- **Database**: Environment variable configuration ready for PostgreSQL connection

### Scaling Considerations
- **Storage Migration**: Easy transition from memory storage to PostgreSQL via interface pattern
- **Session Management**: PostgreSQL session storage configured for production scaling
- **Static Assets**: Optimized build output suitable for CDN deployment

The architecture is designed for easy development while maintaining production readiness, with clear separation of concerns and type safety throughout the stack.