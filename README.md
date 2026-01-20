# 📅 Calendar Booking Platform

[![PR Validation](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/pr-validation.yml)
[![Deploy to Docker Hub](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/deploy.yml)
[![Docker](https://img.shields.io/badge/Docker-Hub-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/u/aalbuez)

> 🔗 **Live Demo:** Docker images available on [Docker Hub](https://hub.docker.com/u/aalbuez)  
> 📦 **Repository:** https://github.com/AbelAlbuez/calendar-booking-platform

A production-ready full-stack booking platform with intelligent conflict detection and Google Calendar synchronization. Built for DesignLi's Technical Lead/Advisor position.

---

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure JWT-based authentication with dev mode
- 📅 **Smart Booking Management** - Create, view, and cancel bookings with validation
- 🔍 **Intelligent Conflict Detection** - Prevents double-booking automatically
- 🗓️ **Google Calendar Integration** - Real-time synchronization with Google Calendar
- 🚫 **Fail-Closed Security** - Rejects bookings if calendar verification fails
- 📱 **Responsive Design** - Beautiful Material UI interface
- 🐳 **Docker Ready** - Published images on Docker Hub with CI/CD
- ⚡ **Automated CI/CD** - GitHub Actions for testing and deployment
- 🧪 **Comprehensive Tests** - Unit and integration tests for backend and frontend

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
npm run bootstrap

# 2. Setup environment variables (see below)
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

## 🔧 Environment Variables Setup

### For Reviewers/Interviewers: Quick Test Setup

**Minimal setup without Google OAuth (Development mode):**

1. Create `apps/api/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="test-secret-key-for-demo"
JWT_EXPIRATION="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

2. Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

**That's it!** You can now test the application with dev login (no Google required).

### For Full Google Calendar Integration

<details>
<summary><b>Click to expand Google OAuth setup</b></summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google Calendar API**
4. Create **OAuth 2.0 Client ID** credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Secret

**Update `apps/api/.env`:**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRATION="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"

# Add these for Google Calendar
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

**Update `apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# Add this for Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id-here"
```
</details>

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- NestJS - Progressive Node.js framework
- Prisma - Next-generation ORM
- SQLite - Lightweight database
- Google Calendar API - Calendar integration
- JWT - Authentication
- Jest - Testing framework

**Frontend:**
- Next.js 14 - React framework
- Material UI - Component library
- TypeScript - Type safety
- Axios - HTTP client
- React Testing Library - Component testing

**DevOps:**
- Docker & Docker Compose - Containerization
- GitHub Actions - CI/CD
- Docker Hub - Image registry
- Dependabot - Dependency updates

### Project Structure

```
calendar-booking-platform/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # Authentication (OAuth, JWT, Dev login)
│   │   │   │   ├── bookings/   # Booking CRUD & validation
│   │   │   │   ├── calendar/   # Google Calendar sync
│   │   │   │   ├── users/      # User management
│   │   │   │   └── common/     # Shared utilities
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/             # Database schema & migrations
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
│       ├── pr-validation.yml   # Lint, test, build
│       ├── deploy.yml          # Docker Hub deployment
│       └── dependabot.yml      # Auto updates
│
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production deployment
└── package.json                # Monorepo config
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

For development/testing, use **Dev Login** (no Google required):

```bash
curl -X POST http://localhost:3001/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

For production, use Google OAuth:
- Frontend redirects to `/api/auth/google`
- Backend handles OAuth flow
- Returns JWT token

**All endpoints (except `/auth/dev-login`) require JWT:**
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Authentication** |
| `POST` | `/auth/dev-login` | Development login | No |
| `GET` | `/auth/google` | Google OAuth redirect | No |
| `GET` | `/auth/me` | Get current user | Yes |
| **Bookings** |
| `POST` | `/bookings` | Create booking | Yes |
| `GET` | `/bookings` | List bookings | Yes |
| `GET` | `/bookings/:id` | Get booking | Yes |
| `DELETE` | `/bookings/:id` | Cancel booking | Yes |
| **Calendar** |
| `POST` | `/calendar/connect` | Connect Google Calendar | Yes |
| `GET` | `/calendar/status` | Check connection status | Yes |

<details>
<summary><b>Click for detailed API examples</b></summary>

#### Create Booking
```bash
POST /api/bookings
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Team Meeting",
  "startUtc": "2025-01-20T14:00:00.000Z",
  "endUtc": "2025-01-20T15:00:00.000Z"
}

# Success Response (201)
{
  "id": "uuid",
  "title": "Team Meeting",
  "startUtc": "2025-01-20T14:00:00.000Z",
  "endUtc": "2025-01-20T15:00:00.000Z",
  "status": "Active"
}

# Conflict Response (409)
{
  "statusCode": 409,
  "message": "Booking conflicts with existing booking",
  "conflictType": "internal"
}
```

#### List Bookings
```bash
GET /api/bookings?status=Active
Authorization: Bearer <token>

# Response
[
  {
    "id": "uuid",
    "title": "Team Meeting",
    "startUtc": "2025-01-20T14:00:00.000Z",
    "endUtc": "2025-01-20T15:00:00.000Z",
    "status": "Active"
  }
]
```

#### Cancel Booking
```bash
DELETE /api/bookings/:id
Authorization: Bearer <token>

# Response (200)
{
  "id": "uuid",
  "status": "Cancelled"
}
```
</details>

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:cov

# Run specific tests
npm run test:api      # Backend only
npm run test:web      # Frontend only

# Watch mode
cd apps/api
npm run test:watch
```

**Test Coverage:**
- Backend: Unit + Integration tests
- Frontend: Component tests with React Testing Library
- E2E: API endpoint testing

---

## 🐳 Docker Deployment

### Using Pre-built Images (Recommended)

```bash
# Pull latest images from Docker Hub
docker pull aalbuez/calendar-booking-api:latest
docker pull aalbuez/calendar-booking-web:latest

# Run with docker-compose
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop
docker compose -f docker-compose.prod.yml down
```

### Building Locally

```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Available Ports
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

## 🚀 CI/CD Pipeline

Automated workflows run on every push/PR:

### 1. PR Validation
- ✅ Linting
- ✅ Type checking (non-blocking)
- ✅ Unit & integration tests
- ✅ Build verification
- ✅ Docker build test

### 2. Deployment (main branch only)
- ✅ Build Docker images
- ✅ Push to Docker Hub
- ✅ Tag with commit SHA
- ✅ Update `latest` tag

### 3. Dependabot
- ✅ Weekly dependency updates
- ✅ Security vulnerability alerts

**View workflows:** https://github.com/AbelAlbuez/calendar-booking-platform/actions

---

## 💡 Key Features Explained

### Intelligent Conflict Detection

The system prevents double-booking through multiple layers:

1. **Internal Database Check** - Validates against existing bookings in the database
2. **Google Calendar Check** - Verifies no conflicts in user's Google Calendar
3. **Fail-Closed Policy** - If calendar verification fails, booking is rejected (security-first approach)

### Development Login

For testing without Google OAuth setup:

```bash
# Use dev login endpoint
POST /api/auth/dev-login
{
  "email": "reviewer@example.com",
  "name": "Reviewer"
}

# Returns JWT token
# Use token for all subsequent requests
```

### Google Calendar Integration

- OAuth 2.0 flow for secure authorization
- Real-time event conflict checking
- Respects user privacy (fail-closed)
- Optional: Works without Google Calendar connection

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
cd apps/api
npx prisma studio        # GUI for database
npx prisma migrate dev   # Create migration
npx prisma generate      # Regenerate client
```

---

## 📊 Project Status

**Completion: 98%**

- ✅ Backend API with NestJS
- ✅ Frontend with Next.js
- ✅ Google Calendar Integration
- ✅ Conflict Detection
- ✅ JWT Authentication
- ✅ Development Login
- ✅ Docker Containerization
- ✅ CI/CD with GitHub Actions
- ✅ Docker Hub Deployment
- ✅ Comprehensive Tests
- ✅ Documentation
- 🔄 Video Demo (in progress)

---

## 🎥 Demo Video

A 1-minute demonstration video is included showing:
- Application functionality
- Booking creation and validation
- Conflict detection
- Google Calendar integration
- Technical architecture

---

## 🤝 For Reviewers

### Quick Test Flow

1. **Start the application** (Docker Hub recommended)
```bash
docker pull aalbuez/calendar-booking-api:latest && \
docker pull aalbuez/calendar-booking-web:latest && \
docker run -d -p 3001:3001 --name api aalbuez/calendar-booking-api:latest && \
docker run -d -p 3000:3000 --name web aalbuez/calendar-booking-web:latest && \
open http://localhost:3000
```

2. **Test dev login** (no Google required)
   - Click "Dev Login" button
   - Enter any email and name

3. **Create bookings**
   - Try creating a booking
   - Try creating a conflicting booking (should fail)

4. **View bookings**
   - See list of all bookings
   - Cancel a booking

5. **Optional: Google Calendar**
   - Connect Google Calendar
   - Create booking in Google Calendar
   - Try creating conflicting booking in app

### What to Look For

- ✅ Clean, maintainable code structure
- ✅ Proper error handling
- ✅ Security best practices (JWT, fail-closed)
- ✅ Comprehensive tests
- ✅ Professional documentation
- ✅ Production-ready Docker setup
- ✅ Automated CI/CD pipeline

---

## 📧 Contact

**Abel Albuez**
- GitHub: [@AbelAlbuez](https://github.com/AbelAlbuez)
- Email: [Available in repo]

**For Recruiters:**
- Mariana Rubio: mariana.rubio@designli.co
- Diego Morales: diego.morales@designli.co

---

## 📄 License

MIT License - Built for DesignLi Technical Lead/Advisor position

---

## 🙏 Acknowledgments

**Tech Stack:**
- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Material UI](https://mui.com/) - UI components
- [Google Calendar API](https://developers.google.com/calendar) - Calendar integration
- [Docker](https://www.docker.com/) - Containerization
- [GitHub Actions](https://github.com/features/actions) - CI/CD

---

**Made with ❤️ for DesignLi**