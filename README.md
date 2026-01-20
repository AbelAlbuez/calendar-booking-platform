# 📅 Calendar Booking Platform

[![PR Validation](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/pr-validation.yml)
[![Deploy to Docker Hub](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/deploy.yml)
[![Docker](https://img.shields.io/badge/Docker-Hub-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/u/aalbuez)

> 🔗 **Live Demo:** Docker images available on [Docker Hub](https://hub.docker.com/u/aalbuez)  
> 📦 **Repository:** https://github.com/AbelAlbuez/calendar-booking-platform

A production-ready full-stack booking platform with intelligent conflict detection and Google Calendar synchronization. Built with modern UI/UX principles and scalable architecture for DesignLi's Technical Lead/Advisor position.

---

## 📸 Screenshots

<div align="center">

### Login Page
![Login Page](screenshots/Calendar%20APP%20-%20Index%20Page.png)
*Clean authentication interface with dev mode for testing*

### Dashboard - Disconnected
![Dashboard Disconnected](screenshots/Calendar%20APP%20-%20Home%20Page%20(Disconnected).png)
*Main dashboard showing bookings with internal conflict detection only*

### Dashboard - Connected to Google Calendar
![Dashboard Connected](screenshots/Calendar%20APP%20-%20Home%20Page%20(Connected).png)
*Dashboard with Google Calendar integration enabled for enhanced conflict checking*

### Conflict Detection in Action
![Conflict Error](screenshots/Calendar%20APP%20-%20Conflicts%20Error.png)
*Real-time conflict detection preventing double-booking*

</div>

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based auth with dedicated login page
- 📅 **Smart Booking Management** - Create, view, and cancel bookings with real-time validation
- 🔍 **Intelligent Conflict Detection** - Prevents double-booking with proper overlap algorithm
- 🗓️ **Google Calendar Integration** - Real-time synchronization with personal calendar
- 🚫 **Fail-Closed Security** - Rejects bookings if calendar verification fails

### Modern UI/UX
- 🎨 **Material-UI Design** - Professional interface with modal dialogs and rich cards
- ⚡ **Floating Action Button (FAB)** - Quick access to create bookings
- 💬 **Real-time Feedback** - Success/error snackbars and loading states
- ✅ **Smart Form Validation** - Comprehensive validation with duration calculator
- 🎯 **Responsive Layout** - Beautiful animations and smooth transitions
- 👤 **User Management** - Avatar menu with profile info and logout

### Technical Excellence
- 🐳 **Docker Ready** - Pre-built images published on Docker Hub
- ⚡ **Automated CI/CD** - GitHub Actions for testing and deployment
- 🧪 **Comprehensive Testing** - Unit and integration tests with high coverage
- 📚 **Professional Documentation** - Complete API docs and setup guides
- 🔄 **Database Management** - Easy reset and migration tools
- 🏗️ **Scalable Architecture** - Monorepo, modular design, type-safe

---

## 🚀 Quick Start (3 Options)

### Option 1: Docker Hub (Fastest - 2 minutes) ⭐

**No setup required! Pull and run pre-built images:**

```bash
# Pull images
docker pull aalbuez/calendar-booking-api:latest
docker pull aalbuez/calendar-booking-web:latest

# Run with docker-compose
curl -O https://raw.githubusercontent.com/AbelAlbuez/calendar-booking-platform/main/docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d

# Or run manually
docker run -d -p 3001:3001 --name calendar-api \
  -e DATABASE_URL="file:/data/dev.db" \
  -e JWT_SECRET="your-secret" \
  -v $(pwd)/data:/data \
  aalbuez/calendar-booking-api:latest

docker run -d -p 3000:3000 --name calendar-web \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001/api" \
  aalbuez/calendar-booking-web:latest

# Access the app
open http://localhost:3000
```

**Docker Hub Links:**
- Backend: https://hub.docker.com/r/aalbuez/calendar-booking-api
- Frontend: https://hub.docker.com/r/aalbuez/calendar-booking-web

### Option 2: Local Docker Build (5 minutes)

```bash
git clone https://github.com/AbelAlbuez/calendar-booking-platform.git
cd calendar-booking-platform
docker compose up -d --build
```

Access: http://localhost:3000

### Option 3: Local Development (10 minutes)

```bash
# 1. Clone & Install
git clone https://github.com/AbelAlbuez/calendar-booking-platform.git
cd calendar-booking-platform
npm install

# 2. Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit .env files with your values

# 3. Setup database
cd apps/api
npx prisma migrate dev
npx prisma generate
cd ../..

# 4. Start servers
npm run dev

# Access: http://localhost:3000
```

---

## 🎨 UI/UX Features

### Modern Interface Components

- **Modal Dialogs** - Clean booking creation with real-time validation feedback
- **Floating Action Button (FAB)** - Quick access positioned at bottom-right corner
- **Rich Booking Cards** - Status chips, upcoming indicators, and hover effects
- **User Avatar Menu** - Profile information display with logout functionality
- **Active Bookings Counter** - Real-time count displayed in application header
- **Enhanced Empty States** - Helpful messages with call-to-action buttons

### Interactive Elements

- **Loading States** - Elegant spinners during asynchronous operations
- **Success Notifications** - Snackbar feedback for user actions
- **Error Handling** - Clear, contextual error messages in modals and alerts
- **Confirmation Dialogs** - Prevent accidental deletions with booking details preview
- **Hover Effects** - Card elevation changes and smooth CSS transitions
- **Duration Calculator** - Real-time computation of booking length in the form

### Validation & Security

- **Client-Side Validation** - Real-time form validation with helper text
- **Minimum Duration Check** - Enforces 15-minute minimum booking length
- **Future Bookings Only** - Prevents scheduling meetings in the past
- **Time Range Validation** - Ensures end time is after start time
- **Conflict Warnings** - Clear visual indicators for booking conflicts
- **Fail-Closed Architecture** - Calendar verification failures prevent risky bookings

---

## 📊 Project Status

**Completion: 100%** ✅

### Completed Features

- ✅ **Backend API** - NestJS with TypeScript
- ✅ **Frontend Application** - Next.js 14 with Material-UI
- ✅ **Modern UI/UX** - Modal dialogs, FAB, rich cards, and animations
- ✅ **Google Calendar Integration** - OAuth 2.0 with real-time sync
- ✅ **Conflict Detection** - Internal database + Google Calendar with proper overlap algorithm
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **User Management** - Dedicated login page with logout functionality
- ✅ **Docker Containerization** - Multi-stage builds with optimizations
- ✅ **CI/CD Pipeline** - Automated testing and deployment
- ✅ **Docker Hub Deployment** - Published images with version tagging
- ✅ **Comprehensive Testing** - Unit, integration, and E2E tests
- ✅ **Professional Documentation** - Complete guides and API docs
- ⏳ **Demo Video** - Ready to record (1-minute walkthrough)

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- NestJS (Node.js framework)
- TypeScript
- Prisma ORM
- SQLite (development) / PostgreSQL (production-ready)
- JWT for authentication
- Google Calendar API integration

**Frontend:**
- Next.js 14 (React framework)
- TypeScript
- Material-UI (MUI) v5
- Axios for API calls
- Client-side authentication

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Docker Hub (container registry)
- Automated testing and deployment

### Project Structure

```
calendar-booking-platform/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # Authentication
│   │   │   │   ├── bookings/   # Booking management
│   │   │   │   ├── calendar/   # Google Calendar integration
│   │   │   │   ├── users/      # User management
│   │   │   │   └── common/     # Shared utilities
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Database migrations
│   │   ├── test/               # E2E tests
│   │   └── Dockerfile
│   │
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Next.js pages
│       │   ├── services/       # API client
│       │   └── styles/         # Global styles
│       └── Dockerfile
│
├── packages/
│   └── shared/                 # Shared TypeScript types
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│
├── screenshots/                # Application screenshots
├── docker-compose.yml          # Local development
└── package.json                # Monorepo configuration
```

---

## 🔧 Environment Variables

### For Quick Testing (No Google OAuth)

**Backend (`apps/api/.env`):**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

**Frontend (`apps/web/.env.local`):**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### For Full Google Calendar Integration

<details>
<summary><b>Click to expand Google OAuth setup instructions</b></summary>

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing one

2. **Enable Google Calendar API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`

4. **Add credentials to .env**

**Backend (`apps/api/.env`):**
```env
# ... previous variables ...
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
```

**Frontend (`apps/web/.env.local`):**
```env
# ... previous variables ...
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

</details>

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All endpoints (except `/auth/dev-login` and `/auth/google`) require JWT authentication:

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Authentication** |
| `POST` | `/auth/dev-login` | Development login (no Google) | No |
| `GET` | `/auth/google` | Google OAuth redirect | No |
| `GET` | `/auth/me` | Get current user info | Yes |
| **Bookings** |
| `POST` | `/bookings` | Create new booking | Yes |
| `GET` | `/bookings` | List user bookings | Yes |
| `GET` | `/bookings?status=Active` | Filter by status | Yes |
| `DELETE` | `/bookings/:id` | Cancel booking | Yes |
| **Calendar** |
| `POST` | `/calendar/connect` | Connect Google Calendar | Yes |
| `GET` | `/calendar/status` | Check connection status | Yes |
| `DELETE` | `/calendar/disconnect` | Disconnect calendar | Yes |

### Detailed Examples

<details>
<summary><b>POST /auth/dev-login - Development Login</b></summary>

**Request:**
```bash
POST /api/auth/dev-login
Content-Type: application/json

{
  "email": "reviewer@example.com",
  "name": "Reviewer"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "reviewer@example.com",
    "name": "Reviewer",
    "timezone": "UTC"
  }
}
```
</details>

<details>
<summary><b>POST /bookings - Create Booking</b></summary>

**Request:**
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Standup",
  "startUtc": "2026-01-22T14:00:00.000Z",
  "endUtc": "2026-01-22T15:00:00.000Z"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "title": "Team Standup",
  "startUtc": "2026-01-22T14:00:00.000Z",
  "endUtc": "2026-01-22T15:00:00.000Z",
  "status": "Active",
  "createdAt": "2026-01-19T23:00:00.000Z"
}
```

**Conflict Response (409):**
```json
{
  "statusCode": 409,
  "message": "Booking conflicts with existing booking",
  "conflictType": "internal"
}
```
</details>

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test:cov

# Run specific test suites
npm run test:api      # Backend only
npm run test:web      # Frontend only

# Watch mode for development
cd apps/api
npm run test:watch
```

---

## 🐳 Docker Deployment

### Using Pre-built Images (Recommended)

```bash
# Pull latest images
docker pull aalbuez/calendar-booking-api:latest
docker pull aalbuez/calendar-booking-web:latest

# Run with docker-compose
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop services
docker compose -f docker-compose.prod.yml down
```

### Building Locally

```bash
# Build and start
docker compose up -d --build

# Rebuild specific service
docker compose up -d --build api
docker compose up -d --build web
```

---

## 🚀 CI/CD Pipeline

### Automated Workflows

#### 1. PR Validation (`.github/workflows/pr-validation.yml`)

Runs on every pull request and push:

- ✅ **Linting** - ESLint checks
- ✅ **Type Checking** - TypeScript compilation
- ✅ **Unit Tests** - Jest test suites
- ✅ **Build Verification** - Backend and frontend builds
- ✅ **Docker Build Test** - Validates Dockerfiles

#### 2. Docker Hub Deployment (`.github/workflows/deploy.yml`)

Runs on pushes to `main` branch:

- ✅ **Build Docker Images** - Multi-stage optimized builds
- ✅ **Push to Docker Hub** - Automated registry upload
- ✅ **Version Tagging** - Git SHA and `latest` tags

**View workflows:** https://github.com/AbelAlbuez/calendar-booking-platform/actions

---

## 📝 Development Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:api          # Backend only
npm run dev:web          # Frontend only

# Building
npm run build            # Build all
npm run build:api        # Backend only
npm run build:web        # Frontend only

# Testing
npm run test             # All tests
npm run test:cov         # With coverage
npm run test:watch       # Watch mode

# Code Quality
npm run lint             # Lint code
npm run typecheck        # Type check
npm run format           # Format code

# Database
npm run db:reset         # Reset database
cd apps/api
npx prisma studio        # GUI for database
npx prisma migrate dev   # Create migration
npx prisma generate      # Regenerate client
```

---

## 💡 Key Features Explained

### Intelligent Conflict Detection

The system prevents double-booking through multiple layers:

1. **Internal Database Check** - Validates against existing bookings
2. **Google Calendar Check** - Verifies no conflicts with proper overlap algorithm: `(eventStart < bookingEnd) AND (eventEnd > bookingStart)`
3. **Fail-Closed Policy** - If calendar verification fails, booking is rejected (security-first)

### Development Login

For testing without Google OAuth setup:

```bash
POST /api/auth/dev-login
{
  "email": "reviewer@example.com",
  "name": "Reviewer"
}
```

### Google Calendar Integration

- OAuth 2.0 flow for secure authorization
- Real-time event conflict checking with proper overlap detection
- Respects user privacy (fail-closed)
- Optional: Works without Google Calendar connection

---

## 🎓 Technical Decisions

### Why NestJS?
- Enterprise-grade Node.js framework
- Built-in dependency injection
- Excellent TypeScript support
- Modular architecture
- Easy to test and maintain

### Why Next.js?
- React framework with SSR capabilities
- Excellent developer experience
- Built-in routing and optimization
- Production-ready out of the box
- Large ecosystem and community

### Why Material-UI?
- Professional design system
- Comprehensive component library
- Excellent TypeScript support
- Customizable theming
- Industry-standard UI patterns

### Why SQLite (Development)?
- Zero configuration required
- File-based database
- Fast for development
- Easy to reset and test
- PostgreSQL-compatible schema (production-ready)

### Why Docker?
- Consistent environments
- Easy deployment
- Scalable architecture
- Isolated dependencies
- Industry standard

---

## 🏗️ Architecture Decisions

### Backend Architecture

#### Monorepo Structure with npm Workspaces

**Decision:** Single repository with multiple packages (`apps/api`, `apps/web`, `packages/shared`).

**Rationale:**
- Shared TypeScript types between frontend/backend without duplication
- Simplified dependency management and versioning
- Easier to maintain consistency across codebase
- Single CI/CD pipeline for entire stack

**Alternative:** Separate repositories | **Why Rejected:** Requires duplicating types, complicates deployment

---

#### Prisma ORM over TypeORM

**Decision:** Use Prisma for database access and migrations.

**Rationale:**
- Type-safe database client generated from schema
- Intuitive migration system with automatic SQL generation
- Excellent TypeScript integration with autocomplete
- Better developer experience than raw SQL or TypeORM

**Alternative:** TypeORM or raw SQL | **Why Rejected:** TypeORM has weaker typing, raw SQL lacks type safety

---

#### JWT-Based Authentication

**Decision:** Stateless JWT tokens stored in localStorage.

**Rationale:**
- Stateless - no server-side session storage required
- Scalable across multiple API instances
- Simple to implement and validate
- Works seamlessly with SPA architecture

**Alternative:** Session-based auth | **Why Rejected:** Requires session storage, harder to scale

---

#### Fail-Closed Security Policy

**Decision:** Reject bookings if Google Calendar verification fails.

**Rationale:**
- Prevents accidental double-booking during API outages
- Security-first approach protects user schedules
- Users must explicitly disconnect calendar to bypass checking
- Better UX than silently failing and allowing conflicts

**Alternative:** Fail-open (allow on error) | **Why Rejected:** Risk of double-booking, undermines core feature

---

#### Time Overlap Detection Algorithm

**Decision:** Proper overlap validation: `(eventStart < bookingEnd) AND (eventEnd > bookingStart)`

**Rationale:**
- Mathematically correct overlap detection
- Prevents false positives (was the original bug we fixed)
- Handles all edge cases (before, after, during, contains)
- Industry-standard algorithm

**Alternative:** Simple range check | **Why Rejected:** Produces false positives

---

#### Modular NestJS Architecture

**Decision:** Separate modules for Auth, Bookings, Calendar, Users, Common.

**Rationale:**
- Clear separation of concerns
- Each module is independently testable
- Easy to scale and add features
- Follows SOLID principles and NestJS best practices

**Alternative:** Monolithic single module | **Why Rejected:** Difficult to maintain, poor testability

---

### Frontend Architecture

#### Client-Side State Management

**Decision:** React hooks (useState, useEffect) without Redux.

**Rationale:**
- Sufficient for application complexity
- Simpler codebase, less boilerplate
- Faster development with built-in React features

**Alternative:** Redux or Zustand | **Why Rejected:** Overkill for this application size

---

#### API Service Layer Pattern

**Decision:** Centralized API service (`apiService.ts`) with typed methods.

**Rationale:**
- Single source of truth for API interactions
- Easy to add authentication headers globally
- Type-safe API calls with TypeScript
- Simplifies error handling and retry logic

**Alternative:** Direct fetch calls | **Why Rejected:** Duplicated code, inconsistent error handling

---

### DevOps & Infrastructure

#### Multi-Stage Docker Builds

**Decision:** Separate build and runtime stages in Dockerfiles.

**Rationale:**
- Smaller final image size (~100MB vs ~1GB)
- Faster deployment and pull times
- Excludes dev dependencies from production
- Industry best practice

**Alternative:** Single-stage build | **Why Rejected:** Large image size, includes unnecessary dependencies

---

#### Docker Hub for Image Distribution

**Decision:** Pre-built images on Docker Hub, not building on deploy.

**Rationale:**
- Faster deployment (pull vs build)
- Consistent images across environments
- Easy for reviewers to test without building
- Professional deployment workflow

**Alternative:** Build on deployment | **Why Rejected:** Slower, inconsistent builds

---

#### GitHub Actions CI/CD

**Decision:** Automated testing and deployment via GitHub Actions.

**Rationale:**
- Native GitHub integration
- Free for public repositories
- Easy to configure with YAML
- Automated Docker Hub pushes on merge to main

**Alternative:** Jenkins or CircleCI | **Why Rejected:** More complex setup, potential costs

---

### Database Architecture

#### SQLite for Development, PostgreSQL-Ready

**Decision:** SQLite with Prisma schema compatible with PostgreSQL.

**Rationale:**
- Zero configuration for local development
- Fast iteration and testing
- Easy to reset with `npm run db:reset`
- Migration to PostgreSQL requires only connection string change

**Alternative:** PostgreSQL locally | **Why Rejected:** Additional setup complexity

---

#### UTC Timestamps for All Dates

**Decision:** Store all dates in UTC, convert in UI.

**Rationale:**
- Avoids timezone confusion
- Consistent data storage
- Easy to convert to user's timezone in frontend
- Standard practice for international applications

**Alternative:** Store in user's timezone | **Why Rejected:** Complicated queries, DST issues

---

#### Soft Delete with Status Enum

**Decision:** Mark bookings as "Cancelled" instead of deleting rows.

**Rationale:**
- Audit trail for cancelled bookings
- Allows analytics on cancellation patterns
- Can restore accidentally cancelled bookings
- Maintains referential integrity

**Alternative:** Hard delete | **Why Rejected:** Lost data, no audit trail

---

### Security & Code Quality

#### TypeScript Strict Mode

**Decision:** Enable `strict: true` in all `tsconfig.json` files.

**Rationale:**
- Catches bugs at compile time
- Better IDE autocomplete and IntelliSense
- Forces explicit typing, improving code quality

**Alternative:** Loose configuration | **Why Rejected:** Loses type safety benefits

---

### Architecture Summary

Every architectural decision balances:
- **Developer Experience** - Fast development, easy debugging
- **Production Readiness** - Scalable, secure, maintainable
- **Type Safety** - Catch bugs at compile time
- **Industry Standards** - Use proven patterns and tools

The result is a **clean, scalable architecture** that's easy to understand, test, and deploy.

---

## 🤝 For Reviewers

### Quick Test Flow (5 Minutes)

#### 1. **Start the Application**

**Recommended: Docker Hub (fastest)**
```bash
docker pull aalbuez/calendar-booking-api:latest && \
docker pull aalbuez/calendar-booking-web:latest && \
docker run -d -p 3001:3001 --name api \
  -e DATABASE_URL="file:/data/dev.db" \
  -e JWT_SECRET="demo-secret-key" \
  aalbuez/calendar-booking-api:latest && \
docker run -d -p 3000:3000 --name web \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001/api" \
  aalbuez/calendar-booking-web:latest && \
echo "✅ App ready at http://localhost:3000"
```

#### 2. **Login to the Application**

- Open http://localhost:3000
- Enter any email (e.g., `reviewer@designli.co`)
- Enter any name (e.g., `Reviewer`)
- Click "Login"

#### 3. **Create Bookings**

- Click the blue "+" FAB button (bottom-right)
- Fill in booking details
- Notice the duration calculator
- Click "Create Booking"

#### 4. **Test Conflict Detection**

- Try to create an overlapping booking
- System will prevent it with clear error message

#### 5. **Cancel a Booking**

- Click trash icon on any booking
- Confirm in dialog
- Booking status changes to "Cancelled"

### What to Look For

**UI/UX:**
- ✅ Clean, modern Material-UI design
- ✅ Smooth animations and transitions
- ✅ Clear loading states and error messages
- ✅ Intuitive navigation

**Functionality:**
- ✅ Dedicated login page (no hardcoded users)
- ✅ Real-time form validation
- ✅ Conflict detection works correctly
- ✅ User can logout and login again

**Code Quality:**
- ✅ TypeScript throughout
- ✅ Clean architecture
- ✅ Docker-ready
- ✅ CI/CD pipeline

---

## 📚 Additional Resources

### Documentation

- API Endpoints - See API Documentation section above
- Architecture - See Architecture and Architecture Decisions sections
- Deployment Guide - See Docker Deployment section

### External Links

- **Docker Images**
  - [Backend API](https://hub.docker.com/r/aalbuez/calendar-booking-api)
  - [Frontend Web](https://hub.docker.com/r/aalbuez/calendar-booking-web)
- **GitHub Repository**
  - [Source Code](https://github.com/AbelAlbuez/calendar-booking-platform)
  - [GitHub Actions](https://github.com/AbelAlbuez/calendar-booking-platform/actions)

---

## 🔮 Future Enhancements

Potential features for future iterations:

- [ ] **Recurring Bookings** - Support for daily/weekly/monthly patterns
- [ ] **Email Notifications** - Send confirmation emails for bookings
- [ ] **Multiple Time Zones** - Better support for international users
- [ ] **Team Bookings** - Share bookings with multiple users
- [ ] **Calendar Views** - Day/week/month visualization
- [ ] **Booking Templates** - Pre-defined meeting templates
- [ ] **Analytics Dashboard** - Booking statistics and insights
- [ ] **Mobile Apps** - Native iOS and Android applications

---

## 📄 License

This project is developed as part of a technical assessment for DesignLi.

---

## 👨‍💻 Author

**Abel Albuez**
- GitHub: [@AbelAlbuez](https://github.com/AbelAlbuez)
- Docker Hub: [aalbuez](https://hub.docker.com/u/aalbuez)

---

## 🙏 Acknowledgments

- **DesignLi** - For the opportunity and clear requirements
- **NestJS Team** - For the excellent backend framework
- **Next.js Team** - For the powerful React framework
- **Material-UI Team** - For the comprehensive UI library
- **Prisma Team** - For the modern ORM

---

<div align="center">

**Built with ❤️ for DesignLi's Technical Lead/Advisor Position**

[View on GitHub](https://github.com/AbelAlbuez/calendar-booking-platform) • [Docker Hub](https://hub.docker.com/u/aalbuez) • [Report Bug](https://github.com/AbelAlbuez/calendar-booking-platform/issues)

</div>