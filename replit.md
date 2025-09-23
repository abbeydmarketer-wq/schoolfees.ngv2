# SchoolFee.NG - School Fees Management System

## Overview

SchoolFee.NG is a comprehensive SaaS platform designed for Nigerian schools to streamline fee collection, manage student payments, and reduce debt through AI-powered analytics. The system provides a complete solution for school administration including student management, payment processing, staff payroll, admissions tracking, and financial reporting. Built as a multi-tenant platform, it supports different user roles (administrators, teachers, parents, staff) with role-based access control and features an integrated AI assistant for debt analysis and guidance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19.1.1 with TypeScript for type safety and modern development
- **Styling**: TailwindCSS with DaisyUI component library for rapid UI development
- **State Management**: React hooks with local state management, no complex state management library
- **Charts & Visualization**: Recharts library for financial reports and analytics dashboards
- **Responsive Design**: Mobile-first approach with dedicated mobile navigation and responsive layouts

### Backend Architecture
- **Database**: Supabase as primary backend-as-a-service with PostgreSQL
- **Offline Mode**: Comprehensive mock data system allowing full application functionality without backend
- **Data Layer**: Service layer pattern with centralized data management through dataService.ts
- **Authentication**: Supabase Auth with role-based access control and multi-tenant support

### AI Integration
- **AI Provider**: Google Gemini AI for debt analysis and chatbot functionality
- **Use Cases**: Automated debt risk assessment, payment reminder optimization, and intelligent financial insights
- **Fallback**: Graceful degradation when AI services are unavailable

### Payment Processing
- **Gateways**: Integration support for Paystack, Flutterwave, and manual bank transfers
- **Methods**: Online payments, manual payment recording, and installment plans
- **Verification**: Two-stage payment verification system for manual payments

### Multi-Tenancy
- **School Isolation**: Complete data separation between schools using school-specific identifiers
- **Subdomain Support**: School-specific subdomains for branded access
- **Role Management**: Hierarchical permission system (super admin, school admin, staff, teachers, parents)

### Communication System
- **Channels**: SMS and email communication with template management
- **Automation**: Automated reminders, payment confirmations, and notification workflows
- **Templates**: Customizable message templates with placeholder support

### Reporting & Analytics
- **Financial Reports**: Revenue tracking, debt aging analysis, and payment collection reports
- **Export Capabilities**: PDF generation for invoices, receipts, and official documents
- **Real-time Metrics**: Live dashboard with key performance indicators

## External Dependencies

### Core Services
- **Supabase**: Primary database and authentication service (with offline fallback)
- **Google Gemini AI**: AI-powered insights and chatbot functionality
- **Payment Gateways**: Paystack and Flutterwave for online payment processing

### Development Dependencies
- **Vite**: Fast build tool and development server
- **TypeScript**: Type checking and enhanced developer experience
- **ESLint**: Code quality and consistency enforcement

### UI Libraries
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: Pre-built component system
- **Recharts**: Data visualization and charting

### Communication Services
- **SMS Providers**: Integration ready for Nigerian SMS services
- **Email Services**: Transactional email capabilities through Supabase
- **WhatsApp Business**: Optional integration for customer support