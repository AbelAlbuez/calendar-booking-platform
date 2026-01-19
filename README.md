# 📅 Calendar Booking Platform

[![PR Validation](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/pr-validation.yml)
[![Deploy](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/AbelAlbuez/calendar-booking-platform/actions/workflows/deploy.yml)

> 🔗 **Repository:** https://github.com/AbelAlbuez/calendar-booking-platform

A full-stack booking platform with intelligent conflict detection and Google Calendar synchronization. Built with NestJS, Next.js, and TypeScript.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure JWT-based authentication
- 📅 **Smart Booking Management** - Create, view, and cancel bookings
- 🔍 **Intelligent Conflict Detection** - Prevents double-booking automatically
- 🗓️ **Google Calendar Integration** - Real-time synchronization with your Google Calendar
- 🚫 **Fail-Closed Security** - Rejects bookings if calendar verification fails
- 📱 **Responsive Design** - Beautiful Material UI interface
- 🐳 **Docker Ready** - Containerized for easy deployment
- ⚡ **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Google OAuth 2.0 credentials ([Get them here](https://console.cloud.google.com/))
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbelAlbuez/calendar-booking-platform.git
   cd calendar-booking-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run bootstrap
   ```

3. **Configure environment variables**

   **Backend** (`apps/api/.env`):
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRATION="7d"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Server
   PORT=3001
   CORS_ORIGIN="http://localhost:3000"
   ```

   **Frontend** (`apps/web/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001/api"
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
   ```

4. **Setup database**
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma generate
   cd ../..
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   - Backend API: http://localhost:3001
   - Frontend: http://localhost:3000

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- NestJS - Progressive Node.js framework
- Prisma - Next-generation ORM
- SQLite - Lightweight database
- Google Calendar API - Calendar integration
- JWT - Authentication

**Frontend:**
- Next.js 14 - React framework
- Material UI - Component library
- TypeScript - Type safety
- Axios - HTTP client

**DevOps:**
- Docker & Docker Compose
- GitHub Actions CI/CD
- Dependabot

### Project Structure

```
calendar-booking-platform/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # Authentication (OAuth, JWT)
│   │   │   │   ├── bookings/   # Booking management
│   │   │   │   ├── calendar/   # Google Calendar integration
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
│   └── shared/                 # Shared types & utilities
│       └── src/
│           ├── types/          # TypeScript interfaces
│           └── utils/          # Shared functions
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│
├── docker-compose.yml          # Docker orchestration
└── package.json                # Monorepo config
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All endpoints except `/auth/dev-login` require JWT authentication.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

---

### Endpoints

#### **Authentication**

<details>
<summary><b>POST</b> <code>/auth/dev-login</code> - Development login (no Google required)</summary>

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```
</details>

<details>
<summary><b>GET</b> <code>/auth/me</code> - Get current user</summary>

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "timezone": null
}
```
</details>

---

#### **Bookings**

<details>
<summary><b>POST</b> <code>/bookings</code> - Create a new booking</summary>

**Request Body:**
```json
{
  "title": "Team Meeting",
  "startUtc": "2025-01-20T14:00:00.000Z",
  "endUtc": "2025-01-20T15:00:00.000Z"
}
```

**Response (Success):**
```json
{
  "id": "booking-uuid",
  "userId": "user-uuid",
  "title": "Team Meeting",
  "startUtc": "2025-01-20T14:00:00.000Z",
  "endUtc": "2025-01-20T15:00:00.000Z",
  "status": "Active",
  "createdAt": "2025-01-19T10:30:00.000Z",
  "updatedAt": "2025-01-19T10:30:00.000Z"
}
```

**Error Responses:**

**Conflict with existing booking:**
```json
{
  "statusCode": 409,
  "message": "Booking conflicts with an existing booking",
  "conflictType": "internal"
}
```

**Conflict with Google Calendar:**
```json
{
  "statusCode": 409,
  "message": "Booking conflicts with your Google Calendar",
  "conflictType": "google_calendar"
}
```

**Validation errors:**
```json
{
  "statusCode": 400,
  "message": "End time must be after start time"
}
```
</details>

<details>
<summary><b>GET</b> <code>/bookings</code> - Get user bookings</summary>

**Query Parameters:**
- `status` (optional): `Active` | `Cancelled`

**Response:**
```json
[
  {
    "id": "booking-uuid-1",
    "userId": "user-uuid",
    "title": "Team Meeting",
    "startUtc": "2025-01-20T14:00:00.000Z",
    "endUtc": "2025-01-20T15:00:00.000Z",
    "status": "Active",
    "createdAt": "2025-01-19T10:30:00.000Z",
    "updatedAt": "2025-01-19T10:30:00.000Z"
  },
  {
    "id": "booking-uuid-2",
    "userId": "user-uuid",
    "title": "Lunch Break",
    "startUtc": "2025-01-20T12:00:00.000Z",
    "endUtc": "2025-01-20T13:00:00.000Z",
    "status": "Active",
    "createdAt": "2025-01-19T09:15:00.000Z",
    "updatedAt": "2025-01-19T09:15:00.000Z"
  }
]
```
</details>

<details>
<summary><b>DELETE</b> <code>/bookings/:id</code> - Cancel a booking</summary>

**Response:**
```json
{
  "id": "booking-uuid",
  "userId": "user-uuid",
  "title": "Team Meeting",
  "startUtc": "2025-01-20T14:00:00.000Z",
  "endUtc": "2025-01-20T15:00:00.000Z",
  "status": "Cancelled",
  "createdAt": "2025-01-19T10:30:00.000Z",
  "updatedAt": "2025-01-19T10:35:00.000Z"
}
```

**Note:** Cancelling a booking also removes the event from Google Calendar if connected.
</details>

---

#### **Google Calendar**

<details>
<summary><b>POST</b> <code>/calendar/connect</code> - Connect Google Calendar</summary>

**Request Body:**
```json
{
  "accessToken": "ya29.a0AfH6SMB...",
  "refreshToken": "1//0gZ9Z...",
  "expiry": "2025-01-20T14:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Calendar connected successfully"
}
```
</details>

<details>
<summary><b>GET</b> <code>/calendar/status</code> - Check calendar connection status</summary>

**Response (Connected):**
```json
{
  "connected": true,
  "expiry": "2025-01-20T14:00:00.000Z"
}
```

**Response (Not Connected):**
```json
{
  "connected": false
}
```
</details>

---

## 🔒 Security Features

### Fail-Closed Policy

The system implements a **fail-closed security policy** for Google Calendar verification:

- ✅ If Google Calendar check succeeds → Booking allowed
- ❌ If Google Calendar check fails (API error, timeout, etc.) → **Booking rejected**
- 🔒 This prevents double-booking even if the calendar service is temporarily unavailable

### Conflict Detection

The system checks for conflicts in two layers:

1. **Internal Database Check**
   - Validates against existing bookings in the system
   - Instant verification
   - Always available

2. **Google Calendar Check**
   - Queries user's actual Google Calendar
   - Real-time conflict detection
   - Requires calendar connection

Both checks must pass for a booking to be created.

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

### Manual Docker Build

**Backend:**
```bash
docker build -f apps/api/Dockerfile -t calendar-booking-api .
docker run -p 3001:3001 calendar-booking-api
```

**Frontend:**
```bash
docker build -f apps/web/Dockerfile -t calendar-booking-web .
docker run -p 3000:3000 calendar-booking-web
```

---

## 🧪 Testing

### Run all tests
```bash
npm run test
```

### Run tests with coverage
```bash
npm run test:cov
```

### Run tests in watch mode
```bash
cd apps/api  # or apps/web
npm run test:watch
```

### Test Structure

**Backend Tests:**
- Unit tests for services
- Integration tests for API endpoints
- Located in `apps/api/src/**/*.spec.ts`

**Frontend Tests:**
- Component tests with React Testing Library
- Located in `apps/web/src/**/*.spec.tsx`

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:api          # Start backend only
npm run dev:web          # Start frontend only

# Building
npm run build            # Build all packages
npm run build:api        # Build backend only
npm run build:web        # Build frontend only

# Testing
npm run test             # Run all tests
npm run test:api         # Test backend
npm run test:web         # Test frontend

# Code Quality
npm run lint             # Lint all code
npm run typecheck        # TypeScript type checking
npm run format           # Format code with Prettier

# Database
cd apps/api
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma Client
```

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - Your production URL (production)
6. Copy `Client ID` and `Client Secret` to your `.env` files

---

## 🚀 CI/CD Pipeline

This project uses GitHub Actions for automated testing and deployment.

### Workflows

**PR Validation** (`.github/workflows/pr-validation.yml`):
- Runs on every pull request
- Executes linting, type checking, tests
- Builds all packages
- Tests Docker images

**Deploy** (`.github/workflows/deploy.yml`):
- Runs on push to `main`
- Builds Docker images
- Pushes to GitHub Container Registry
- Can be extended for automatic deployment

**Dependabot**:
- Automatically updates dependencies
- Creates PRs for security updates

---

## 📝 Environment Variables

### Backend (`apps/api/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Prisma database connection | Yes | `file:./dev.db` |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `JWT_EXPIRATION` | JWT token expiration | No | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes | - |
| `PORT` | Server port | No | `3001` |
| `CORS_ORIGIN` | Allowed CORS origin | No | `http://localhost:3000` |

### Frontend (`apps/web/.env.local`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `http://localhost:3001/api` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes | - |

---

## 🤝 Contributing

This is a technical test project. For questions or issues, contact:
- mariana.rubio@designli.co
- diego.morales@designli.co

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👨‍💻 Author

**Abel Albuez**
- GitHub: [@AbelAlbuez](https://github.com/AbelAlbuez)

---

## 🙏 Acknowledgments

Built as a technical test for DesignLi's Technical Lead/Advisor position.

**Tech Stack:**
- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Material UI](https://mui.com/) - Component library
- [Google Calendar API](https://developers.google.com/calendar) - Calendar integration

---

## 📚 Additional Resources

- [API Documentation (Swagger)](http://localhost:3001/api/docs) (when running locally)
- [Prisma Studio](http://localhost:5555) (run `npx prisma studio` in apps/api)
- [Project Demo Video](#) - Coming soon

---

**Made with ❤️ for DesignLi**