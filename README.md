# DentaWave Backend

Backend API for DentaWave — a modern dental clinic management platform built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + Express | API framework |
| TypeScript | Type safety |
| Prisma ORM | Database management |
| PostgreSQL | Database |
| better-auth | Authentication |
| Stripe | Payment processing |
| Zod | Request validation |
| OpenRouter (Gemini) | AI chatbot backend |

## 📋 Features

- ✅ Role-based access control (USER, ADMIN, DOCTOR)
- ✅ Session-based authentication with better-auth
- ✅ Google OAuth social login
- ✅ Clinic, doctor, user, appointment CRUD
- ✅ Stripe payment integration
- ✅ AI chatbot endpoint (OpenRouter API)
- ✅ CORS configured for cross-origin frontend

## 🛠️ Setup

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
BETTER_AUTH_SECRET="your-random-secret"
BETTER_AUTH_URL="http://localhost:8000"
PORT=8000
FRONTEND_URL="http://localhost:3000"
ORIGIN_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenRouter AI Chatbot
OPENROUTER_API_KEY="your-openrouter-key"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRODUCT_ID="prod_..."
STRIPE_PRICE_ID="price_..."
```

### Database Setup

```bash
npx prisma migrate deploy
npx prisma generate
```

### Seed Demo Data

```bash
npx tsx prisma/seed.ts
```

## 🏃 Running

```bash
# Development (auto-reload)
npm run dev

# Production
npm run build && npm start
```

Server runs on `http://localhost:8000`.

## 📚 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server status |

### Clinics
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/clinics` | ❌ |
| GET | `/api/clinics/:id` | ❌ |
| POST | `/api/clinics` | ✅ |
| PUT | `/api/clinics/:id` | ✅ |
| DELETE | `/api/clinics/:id` | ✅ |

### Doctors
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/doctors` | ❌ |
| GET | `/api/doctors/:id` | ❌ |

### Users
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/users` | ✅ |
| GET | `/api/users/:id` | ✅ |

### Appointments
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/appointments` | ✅ |
| GET | `/api/appointments/:id` | ✅ |
| POST | `/api/appointments` | ✅ |
| PUT | `/api/appointments/:id` | ✅ |
| DELETE | `/api/appointments/:id` | ✅ |

### AI Chat
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/chat/chat` | ❌ |

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "How often should I visit the dentist?" }
  ]
}
```

### Payments
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/payments/create-payment` | ✅ |

### Authentication
All auth routes under `/api/auth/*` (handled by better-auth):
- POST `/api/auth/sign-up/email`
- POST `/api/auth/sign-in/email`
- POST `/api/auth/sign-out`
- POST `/api/auth/sign-in/social` (Google OAuth)

## 🗄️ Database Schema

**Roles:** `USER` (patient), `ADMIN`, `DOCTOR`

**Models:** User, Clinic, Appointment, Payment, Session, Account

See `prisma/schema.prisma` for full schema.

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── appointments/
│   ├── chat/
│   │   └── chat.routes.ts        # OpenRouter AI endpoint
│   ├── clinics/
│   ├── doctors/
│   ├── lib/
│   │   ├── auth.ts               # better-auth config
│   │   └── prisma.ts
│   ├── payments/
│   ├── users/
│   └── app.ts                    # Express entry
├── .env
├── .env.local
└── package.json
```

## 🔐 Authentication

Uses better-auth with session cookies. Include session token in requests:

```bash
curl -H "Cookie: better-auth.session_token=TOKEN" http://localhost:8000/api/users
```

## 🌐 Live Deployment

- **Live URL:** https://dentaflow-backend.vercel.app
- **Health check:** https://dentaflow-backend.vercel.app/health

## 📝 Development Notes

- All routes registered in `src/app.ts`
- New routes: create folder with `*.routes.ts`, `*.controller.ts`, register in `app.ts`
- Database changes: update `prisma/schema.prisma`, run `npx prisma migrate dev`

---

*DentaWave — Modern Dental Care Platform*
