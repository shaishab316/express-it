<div align="center">
  <img src="./public/images/logo.png" alt="Express it Logo" width="100" />
</div>

**Express-It** is a production-ready, batteries-included Express.js boilerplate designed to eliminate the friction of starting new backend projects. Built entirely in TypeScript, it combines industry best practices with a modular architecture that lets developers skip configuration and focus on building features. This comprehensive starter kit includes authentication, real-time communication, payment processing, database management, and all the infrastructure components needed to launch scalable applications from day one.

## What Makes Express-It Different

Unlike traditional Express templates that require piecing together libraries and configurations, Express-It provides a complete ecosystem where authentication, database migrations, file uploads, real-time messaging, and payment integration work together seamlessly. The project implements a zero-configuration philosophy—environment variables are auto-generated, database connections are handled automatically, and the modular structure enables rapid feature development without architectural tradeoffs.

The starter kit includes a module builder (`npm run new-module`) that generates route files, controllers, services, interfaces, and validations following established patterns, ensuring consistency across the codebase. This approach maintains architectural integrity while accelerating development velocity for teams of any size.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/shaishab316/express-it.git

# Navigate to project directory
cd express-it

# Install dependencies
npm install

# Set up environment cp .env.example .env
npm run seed:env

# Start development server
npm run dev
```

## Core Technology Stack

Express-It leverages a carefully curated technology stack optimized for production workloads:

| Technology       | Purpose                               | Integration Point                               |
| ---------------- | ------------------------------------- | ----------------------------------------------- |
| Express.js       | Core web framework                    | Application entry point and middleware pipeline |
| TypeScript       | Type safety across the codebase       | All source files with full type definitions     |
| Prisma ORM       | Database abstraction and migrations   | Schema management with auto-generated types     |
| PostgreSQL       | Primary relational database           | Persistent data storage with ACID compliance    |
| Redis            | Caching and job queue                 | Message queues and session management           |
| Socket.io        | Real-time bidirectional communication | WebSocket services for live features            |
| Stripe           | Payment processing                    | Subscription and transaction handling           |
| JWT              | Stateless authentication              | Token-based user sessions                       |
| Winston + Morgan | Structured logging                    | Request/response logging and error tracking     |
| Vitest           | Testing framework                     | Unit and integration tests with coverage        |
| Bull             | Job queue management                  | Background task processing                      |

## Architecture Overview

The application follows a clean, modular architecture with clear separation of concerns. Express-It implements the MVC pattern enhanced with service layers for business logic, middleware for cross-cutting concerns, and utilities for shared functionality.
This architecture enables horizontal scaling, independent module development, and clear data flow from HTTP/WebSocket requests through to database operations and external service calls.

## Project Structure at a Glance

The codebase is organized around functional modules rather than technical layers, promoting feature-driven development. Each module contains all necessary components—routes, controllers, services, interfaces, and validations—making it self-contained and easily maintainable.

```
express-it/
├── src/
│   ├── app.ts                 # Express application configuration
│   ├── server.ts              # Server initialization
│   ├── config/                # Centralized configuration
│   ├── middlewares/           # Express middleware pipeline
│   ├── modules/               # Feature modules (auth, user, chat, etc.)
│   ├── routes/                # API route definitions
│   ├── templates/             # Email and HTML templates
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Shared utilities (db, logger, crypto)
├── prisma/
│   ├── migrations/            # Database migration files
│   └── schema.prisma          # Prisma schema definition
├── public/                    # Static assets
├── test/                      # Test suites
└── docker-compose.yml         # Development environment setup
```

Each module directory follows a consistent pattern:

- **Route:** Express router definitions
- **Controller:** Request handling logic
- **Service:** Business logic implementation
- **Interface:** TypeScript interfaces and types
- **Validation:** Request validation schemas
- **Utils:** Module-specific helper functions

## Key Features Explained

### Authentication & Authorization

Express-It implements a robust JWT-based authentication system with role-based access control (RBAC). The auth module supports email/password authentication, social login (Google, Facebook), OTP-based verification, and password reset workflows. Tokens include configurable expiration times and are validated through middleware that protects protected routes.

### Real-Time Communication

Built on Socket.io, the real-time messaging system enables instant chat functionality, presence tracking, and live notifications. The Socket service manages online users through Redis-backed maps, ensuring synchronization across multiple server instances—a critical feature for production deployments.

### Payment Integration

Native Stripe integration supports subscription billing, one-time payments, and webhooks for transaction synchronization. The payment module handles product management, subscription intervals, and customer billing cycles with automated expiration jobs.

### Database Management

Prisma ORM provides type-safe database access with auto-migration capabilities. The schema defines core entities including users, chats, messages, subscriptions, and transactions with proper relationships and constraints. All database queries leverage generated TypeScript types, eliminating runtime errors.

## Ideal Use Cases

Express-It is particularly well-suited for:

- **SaaS Platforms:** Applications requiring user management, subscription billing, and real-time collaboration features
- **Social Applications:** Chat systems, messaging platforms, or social networks with live interactions
- **E-commerce Backends:** APIs for product catalogs, payment processing, and order management
- **Content Management Systems:** Blogging platforms or CMS solutions with multi-user editing capabilities
- **Enterprise Applications:** Internal tools requiring robust authentication, logging, and modular architecture
- **API Services:** RESTful backends for mobile apps or single-page applications

The modular architecture allows developers to enable or disable features based on project requirements without introducing breaking changes to the core system.

## Developer Experience

Express-It prioritizes developer productivity with thoughtful tooling and automation:

- **Hot Reloading:** Automatic restart during development with `npm run dev`
- **TypeScript Integration:** Full type checking and IntelliSense across the codebase
- **Linting & Formatting:** ESLint and Prettier configurations included
- **Testing:** Vitest with coverage reporting and UI interface
- **Database Studio:** Prisma Studio for visual data inspection
- **Environment Encryption:** .env file encryption with dotenvx
- **Git Hooks:** Pre-commit hooks for code quality enforcement
- **Docker Support:** Complete containerized development environment

The `new-module` command generates boilerplate code following established patterns, ensuring new features integrate seamlessly with existing architecture. This reduces cognitive load and maintains code consistency across teams.

## What's Next

Now that you understand Express-It's architecture and capabilities, here's the recommended learning path:

### Quick Start

- Get the project running locally in under 5 minutes

### Environment Configuration

- Understand the auto-generated configuration system

### Project Structure

- Dive deeper into the directory organization

### Architecture & Design Patterns

- Learn the architectural decisions and patterns used

For deeper dives into specific features:

- **Authentication:** Explore JWT Token System and Auth Middleware Architecture
- **Database:** Study Prisma ORM Integration and Database Schema Design
- **Real-Time:** Read Real-Time Communication with Socket.io
- **Payments:** Understand Payment Processing with Stripe

Express-It provides the foundation—your application logic builds upon this solid base.
