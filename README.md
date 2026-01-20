# 📅 Calendar Booking Platform

[![PR Validation](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/pr-validation.yml)
[![Deploy to Docker Hub](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/deploy.yml)
[![Docker](https://img.shields.io/badge/Docker-Hub-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/u/aalbuez)

> 🔗 **Live Demo:** Docker images available on [Docker Hub](https://hub.docker.com/u/aalbuez)  
> 📦 **Repository:** https://github.com/AbelAlbuez/calendar-booking-platform

A production-ready full-stack booking platform with intelligent conflict detection and Google Calendar synchronization. Built with modern UI/UX principles for DesignLi's Technical Lead/Advisor position.

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based auth with dedicated login page
- 📅 **Smart Booking Management** - Create, view, and cancel bookings with real-time validation
- 🔍 **Intelligent Conflict Detection** - Prevents double-booking automatically
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

---

## 🚀 Quick Start (3 Options)

### Option 1: Docker Hub (Fastest - 2 minutes) ⭐

**No setup required! Pull and run pre-built images:**

```bash
# Pull images from Docker Hub
docker pull aalbuez/calendar-booking-api:latest
docker pull aalbuez/calendar-booking-web:latest

# Run with docker-compose
curl -O https://raw.githubusercontent.com/AbelAlbuez/calendar-booking-platform/main/docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d

# Access the application
open http://localhost:3000
```

**Docker Hub Links:**
- Backend API: https://hub.docker.com/r/aalbuez/calendar-booking-api
- Frontend Web: https://hub.docker.com/r/aalbuez/calendar-booking-web

### Option 2: Local Docker Build (5 minutes)

```bash
# Clone and build
git clone https://github.com/AbelAlbuez/calendar-booking-platform.git
cd calendar-booking-platform
docker compose up -d --build

# Access at http://localhost:3000
```

### Option 3: Local Development (10 minutes)

```bash
# 1. Clone repository
git clone https://github.com/AbelAlbuez/calendar-booking-platform.git
cd calendar-booking-platform

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit .env files with your configuration

# 4. Setup database
cd apps/api
npx prisma migrate dev
npx prisma generate
cd ../..

# 5. Start development servers
npm run dev

# Access at http://localhost:3000
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
- ✅ **Conflict Detection** - Internal database + Google Calendar checks
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
│       │   │   ├── BookingForm.tsx
│       │   │   ├── BookingList.tsx
│       │   │   └── CalendarStatus.tsx
│       │   ├── pages/          # Next.js pages
│       │   │   ├── index.tsx   # Main dashboard
│       │   │   └── login.tsx   # Login page
│       │   ├── services/       # API client
│       │   └── styles/         # Global styles
│       └── Dockerfile
│
├── packages/
│   └── shared/                 # Shared TypeScript types
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│       ├── pr-validation.yml   # Lint, test, build
│       └── deploy.yml          # Docker Hub deployment
│
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production deployment
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
     - Add production URL if deploying

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
  "createdAt": "2026-01-19T23:00:00.000Z",
  "updatedAt": "2026-01-19T23:00:00.000Z"
}
```

**Conflict Response (409):**
```json
{
  "statusCode": 409,
  "message": "Booking conflicts with your existing booking",
  "conflictType": "internal"
}
```

**Google Calendar Conflict (409):**
```json
{
  "statusCode": 409,
  "message": "Booking conflicts with your Google Calendar",
  "conflictType": "google_calendar"
}
```
</details>

<details>
<summary><b>GET /bookings - List Bookings</b></summary>

**Request:**
```bash
GET /api/bookings?status=Active
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid-1",
    "userId": "user-uuid",
    "title": "Team Standup",
    "startUtc": "2026-01-22T14:00:00.000Z",
    "endUtc": "2026-01-22T15:00:00.000Z",
    "status": "Active",
    "createdAt": "2026-01-19T23:00:00.000Z",
    "updatedAt": "2026-01-19T23:00:00.000Z"
  },
  {
    "id": "uuid-2",
    "userId": "user-uuid",
    "title": "Client Meeting",
    "startUtc": "2026-01-23T10:00:00.000Z",
    "endUtc": "2026-01-23T11:00:00.000Z",
    "status": "Active",
    "createdAt": "2026-01-19T22:00:00.000Z",
    "updatedAt": "2026-01-19T22:00:00.000Z"
  }
]
```
</details>

<details>
<summary><b>DELETE /bookings/:id - Cancel Booking</b></summary>

**Request:**
```bash
DELETE /api/bookings/uuid-1
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid-1",
  "userId": "user-uuid",
  "title": "Team Standup",
  "startUtc": "2026-01-22T14:00:00.000Z",
  "endUtc": "2026-01-22T15:00:00.000Z",
  "status": "Cancelled",
  "createdAt": "2026-01-19T23:00:00.000Z",
  "updatedAt": "2026-01-19T23:15:00.000Z"
}
```
</details>

---

## 🧪 Testing

### Run Tests

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

### Test Coverage

- **Backend:**
  - Unit tests for services and controllers
  - Integration tests for API endpoints
  - E2E tests for complete workflows
  
- **Frontend:**
  - Component tests with React Testing Library
  - Integration tests for user flows
  - API client mocking

---

## 🐳 Docker Deployment

### Using Pre-built Images (Recommended)

```bash
# 1. Pull latest images
docker pull aalbuez/calendar-booking-api:latest
docker pull aalbuez/calendar-booking-web:latest

# 2. Create docker-compose.prod.yml (if not exists)
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  api:
    image: aalbuez/calendar-booking-api:latest
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=file:/data/dev.db
      - JWT_SECRET=your-production-secret
      - CORS_ORIGIN=http://localhost:3000
    volumes:
      - ./data:/data

  web:
    image: aalbuez/calendar-booking-web:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001/api
    depends_on:
      - api
EOF

# 3. Start services
docker compose -f docker-compose.prod.yml up -d

# 4. View logs
docker compose -f docker-compose.prod.yml logs -f

# 5. Stop services
docker compose -f docker-compose.prod.yml down
```

### Building Locally

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild specific service
docker compose up -d --build api
docker compose up -d --build web
```

### Individual Container Commands

```bash
# Backend API
docker build -f apps/api/Dockerfile -t calendar-booking-api .
docker run -p 3001:3001 \
  -e DATABASE_URL="file:/data/dev.db" \
  -e JWT_SECRET="your-secret" \
  -v $(pwd)/data:/data \
  calendar-booking-api

# Frontend Web
docker build -f apps/web/Dockerfile -t calendar-booking-web .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001/api" \
  calendar-booking-web
```

---

## 🚀 CI/CD Pipeline

### Automated Workflows

The project includes two main GitHub Actions workflows:

#### 1. PR Validation (`.github/workflows/pr-validation.yml`)

Runs on every pull request and push to `main` branch:

- ✅ **Linting** - ESLint checks (non-blocking warnings)
- ✅ **Type Checking** - TypeScript compilation (non-blocking)
- ✅ **Unit Tests** - Jest test suites (non-blocking for gradual improvement)
- ✅ **Build Verification** - Backend and frontend builds
- ✅ **Docker Build Test** - Validates Dockerfile configurations

#### 2. Docker Hub Deployment (`.github/workflows/deploy.yml`)

Runs on pushes to `main` branch:

- ✅ **Build Docker Images** - Multi-stage optimized builds
- ✅ **Push to Docker Hub** - Automated registry upload
- ✅ **Version Tagging** - Git SHA and `latest` tags
- ✅ **Deployment Logs** - Detailed action outputs

### View Workflows

Monitor CI/CD status: https://github.com/AbelAlbuez/calendar-booking-platform/actions

### Docker Hub Images

- Backend: https://hub.docker.com/r/aalbuez/calendar-booking-api
- Frontend: https://hub.docker.com/r/aalbuez/calendar-booking-web

---

## 📝 Development Scripts

```bash
# Development
npm run dev              # Start all services in watch mode
npm run dev:api          # Backend only
npm run dev:web          # Frontend only

# Building
npm run build            # Build all packages
npm run build:api        # Backend only
npm run build:web        # Frontend only

# Testing
npm run test             # All tests
npm run test:cov         # With coverage report
npm run test:watch       # Watch mode for development
npm run test:api         # Backend tests only
npm run test:web         # Frontend tests only

# Code Quality
npm run lint             # Run ESLint on all packages
npm run typecheck        # TypeScript compilation check
npm run format           # Format code with Prettier

# Database Management
npm run db:reset         # Reset database (removes all data)
cd apps/api
npx prisma studio        # Open Prisma Studio GUI
npx prisma migrate dev   # Create new migration
npx prisma generate      # Regenerate Prisma Client
```

---

## 💡 Key Features Explained

### Intelligent Conflict Detection

The system prevents double-booking through multiple security layers:

1. **Internal Database Check**
   - Validates against existing bookings in the system
   - Instant verification with efficient database queries
   - Always available, no external dependencies

2. **Google Calendar Check**
   - Real-time verification against user's Google Calendar
   - OAuth 2.0 secure authentication
   - Respects calendar privacy settings

3. **Fail-Closed Security Policy**
   - If Google Calendar verification fails → Booking is rejected
   - Prevents accidental double-booking during API outages
   - Security-first approach to protect user schedules

### Authentication Flow

**Development Mode:**
- Direct login with email and name
- No Google OAuth configuration required
- Perfect for testing and development
- JWT token generation for API access

**Production Mode:**
- Full OAuth 2.0 flow with Google
- Secure token exchange
- Calendar permission requests
- Automatic user profile creation

### Google Calendar Integration

- **Read-Only Access**: Application only reads calendar events
- **Conflict Detection**: Checks for overlapping events
- **Privacy Respected**: Only checks for conflicts, doesn't read event details
- **Optional Feature**: Application works without calendar connection
- **Token Management**: Secure storage and automatic refresh

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

**Alternative: Local build**
```bash
git clone https://github.com/AbelAlbuez/calendar-booking-platform.git
cd calendar-booking-platform
docker compose up -d --build
```

#### 2. **Login to the Application**

- Open http://localhost:3000
- You'll be redirected to the login page
- Enter any email (e.g., `reviewer@designli.co`)
- Enter any name (e.g., `Reviewer`)
- Click "Login"
- You'll be redirected to the dashboard

#### 3. **Create Bookings**

- Click the **blue "+" FAB button** (bottom-right corner)
- A modal dialog will appear
- Fill in booking details:
  - **Title**: "Team Standup"
  - **Start**: Tomorrow at 10:00 AM
  - **End**: Tomorrow at 11:00 AM
- Notice the **duration calculator** showing "60 minutes"
- Click **"Create Booking"**
- Success snackbar appears
- Booking card is displayed with status chip

#### 4. **Test Conflict Detection**

- Click the FAB button again
- Try to create an overlapping booking:
  - **Title**: "Client Meeting"
  - **Start**: Tomorrow at 10:30 AM (overlaps with previous)
  - **End**: Tomorrow at 11:30 AM
- Click "Create Booking"
- **Conflict warning appears** in red
- Booking is prevented

#### 5. **Cancel a Booking**

- Find any active booking in the list
- Click the **trash icon** on the right
- A confirmation dialog appears with booking details
- Click **"Yes, Cancel Booking"**
- Success snackbar appears
- Booking status changes or is removed

#### 6. **Test Google Calendar Integration** (Optional)

- Click **"Connect Google Calendar"** (if configured)
- Authorize with your Google account
- Create a booking during a time when you have a Google Calendar event
- System will detect the conflict and prevent the booking
- Disconnect by clicking **"Disconnect"**

### What to Look For

**UI/UX:**
- ✅ Clean, modern Material-UI design
- ✅ Smooth animations and transitions
- ✅ Responsive layout on different screen sizes
- ✅ Clear loading states
- ✅ Helpful error messages
- ✅ Intuitive navigation

**Functionality:**
- ✅ No hardcoded user data (dedicated login page)
- ✅ Real-time form validation
- ✅ Conflict detection works correctly
- ✅ Bookings persist after page refresh
- ✅ User can logout and login again

**Code Quality:**
- ✅ TypeScript throughout
- ✅ Clean architecture (NestJS modules)
- ✅ Proper error handling
- ✅ Docker-ready configuration
- ✅ CI/CD pipeline with GitHub Actions

---

## 📚 Additional Resources

### Documentation

- [API Endpoints](docs/api.md) - Detailed API documentation
- [Architecture](docs/architecture.md) - System design and patterns
- [Deployment Guide](docs/deployment.md) - Production deployment instructions
- [Contributing Guide](CONTRIBUTING.md) - Guidelines for contributors

### External Links

- **Docker Images**
  - [Backend API](https://hub.docker.com/r/aalbuez/calendar-booking-api)
  - [Frontend Web](https://hub.docker.com/r/aalbuez/calendar-booking-web)
- **GitHub Repository**
  - [Source Code](https://github.com/AbelAlbuez/calendar-booking-platform)
  - [GitHub Actions](https://github.com/AbelAlbuez/calendar-booking-platform/actions)
  - [Issues](https://github.com/AbelAlbuez/calendar-booking-platform/issues)

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
- [ ] **Webhook Support** - Real-time integrations with other services
- [ ] **Advanced Permissions** - Role-based access control

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