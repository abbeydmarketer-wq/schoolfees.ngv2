# Overview

SchoolFee.NG is a comprehensive school fees management SaaS platform designed specifically for Nigerian schools. The application provides intelligent fee collection, payment tracking, debt management, and communication tools to streamline educational financial operations. It features multi-role support (administrators, teachers, parents, staff), AI-powered debt analytics, automated payment processing, and comprehensive reporting capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19.1.1 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: TailwindCSS with DaisyUI component library for rapid UI development
- **State Management**: React hooks with local state management, no external state library
- **Routing**: Client-side routing handled within the main App component
- **Charts**: Recharts library for data visualization and analytics dashboards

## Backend Architecture
- **Database**: Supabase (PostgreSQL) with fallback to offline mock data for development
- **Authentication**: Supabase Auth with role-based access control
- **API Layer**: Supabase client for database operations with service abstraction layer
- **File Storage**: Planned integration with cloud storage for document uploads
- **Offline Mode**: Comprehensive mock data system for development without database connection

## Data Storage Solutions
- **Primary Database**: Supabase PostgreSQL for production data
- **Local Storage**: Browser localStorage for session management and preferences
- **Mock Data**: In-memory JavaScript objects for offline development and testing
- **File Handling**: Document generation and printing handled client-side

## Authentication and Authorization
- **Multi-Role System**: Super admin, school admin, teacher, staff, parent roles
- **Session Management**: Supabase session handling with automatic token refresh
- **Access Control**: Role-based permissions with component-level protection
- **School Isolation**: Data segregation by school ID to ensure privacy
- **Impersonation**: Super admin capability to access school accounts for support

## External Dependencies
- **Payment Processing**: Integration points for Paystack, Flutterwave, and bank transfers
- **AI Services**: Google Gemini API for debt analysis and intelligent insights
- **Communication**: SMS and email service integrations for automated notifications
- **Cloud Storage**: File upload and storage for receipts and documents