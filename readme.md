# DentaFlow Backend

Backend API for DentaFlow - A dental clinic management system built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** better-auth
- **Payment:** Stripe (planned)

## 📋 Features

- ✅ Clinic management (CRUD operations)
- ✅ Doctor management (Public read access)
- ✅ User management (Public read access)
- ✅ Appointment management (Protected routes)
- ✅ Role-based access control (USER, ADMIN, DOCTOR)
- ✅ Secure authentication with better-auth

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dentaflow"
   PORT=3000
   BETTER_AUTH_SECRET="your-secret-key"
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Seed admin user (optional)**
   ```bash
   npx ts-node src/seedAdmin.ts
   ```

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000` with auto-reload enabled.

### Production Mode

```bash
npx ts-node src/app.ts
```

## 📚 API Endpoints

### Health Check

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| GET    | `/health` | Server health status |

---

### Clinics (Public)

| Method | Endpoint           | Description       | Auth Required |
| ------ | ------------------ | ----------------- | ------------- |
| GET    | `/api/clinics`     | Get all clinics   | ❌            |
| GET    | `/api/clinics/:id` | Get clinic by ID  | ❌            |
| POST   | `/api/clinics`     | Create new clinic | ❌            |
| PUT    | `/api/clinics/:id` | Update clinic     | ❌            |
| DELETE | `/api/clinics/:id` | Delete clinic     | ❌            |

**Create Clinic Request Body:**

```json
{
  "name": "Dental Care Center",
  "email": "contact@clinic.com",
  "phone": "+1234567890",
  "location": "123 Main St, City"
}
```

---

### Doctors (Public)

| Method | Endpoint           | Description      | Auth Required |
| ------ | ------------------ | ---------------- | ------------- |
| GET    | `/api/doctors`     | Get all doctors  | ❌            |
| GET    | `/api/doctors/:id` | Get doctor by ID | ❌            |

**Response Example:**

```json
[
  {
    "id": "doctor-id",
    "name": "Dr. John Doe",
    "email": "john@clinic.com",
    "image": null,
    "clinicId": "clinic-id"
  }
]
```

---

### Users (Public)

| Method | Endpoint         | Description    | Auth Required |
| ------ | ---------------- | -------------- | ------------- |
| GET    | `/api/users`     | Get all users  | ❌            |
| GET    | `/api/users/:id` | Get user by ID | ❌            |

**Response Example:**

```json
[
  {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "image": null,
    "clinicId": null
  }
]
```

---

### Appointments (Protected)

| Method | Endpoint                | Description            | Auth Required |
| ------ | ----------------------- | ---------------------- | ------------- |
| GET    | `/api/appointments`     | Get all appointments   | ✅            |
| GET    | `/api/appointments/:id` | Get appointment by ID  | ✅            |
| POST   | `/api/appointments`     | Create new appointment | ✅            |
| PUT    | `/api/appointments/:id` | Update appointment     | ✅            |
| DELETE | `/api/appointments/:id` | Cancel appointment     | ✅            |

**Note:** All appointment endpoints require authentication via `better-auth` session.

---

### Authentication

Authentication is handled by `better-auth`. All auth endpoints are available under `/api/auth`.

**Default Admin Credentials:**

```
Email: admin@dentaflow.com
Password: Admin123!
```

---

## 🗄️ Database Schema

### Roles

- `USER` - Regular user
- `ADMIN` - Administrator with full access
- `DOCTOR` - Doctor role

### Models

**User**

- id, name, email, role, image, clinicId
- Relations: sessions, accounts, appointments

**Clinic**

- id, name, status, email, phone, location
- Relations: doctors, appointments

**Appointment**

- id, status, date, userId, doctorId, clinicId
- Status: BOOKED, DONE, CANCELLED

**Session & Account**

- Managed by better-auth for authentication

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── generated/prisma/      # Auto-generated Prisma client
│   ├── lib/
│   │   ├── auth.ts           # better-auth configuration
│   │   ├── prisma.ts         # Prisma client instance
│   │   └── authMiddleware.ts # Authentication middleware
│   ├── clinics/
│   │   ├── clinics.routes.ts
│   │   ├── clinics.controller.ts
│   │   └── clinics.service.ts
│   ├── doctors/
│   │   ├── doctors.routes.ts
│   │   ├── doctors.controller.ts
│   │   └── doctors.service.ts
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── appointments/
│   │   ├── appointments.routes.ts
│   │   ├── appointments.controller.ts
│   │   └── appointments.service.ts
│   ├── payments/              # Payment integration (planned)
│   ├── types/                 # TypeScript type definitions
│   ├── app.ts                 # Express app setup
│   └── seedAdmin.ts           # Admin user seeder
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

---

## 🔐 Authentication

The application uses `better-auth` for session-based authentication.

### Protected Routes

To access protected routes (e.g., appointments), include the session token:

```bash
curl -H "Authorization: Bearer <session-token>" http://localhost:3000/api/appointments
```

### Auth Middleware

The `requireAuth` middleware from `src/lib/authMiddleware.ts` protects routes that need authentication.

---

## 🧪 Testing APIs

Example requests:

```bash
# Health check
curl http://localhost:3000/health

# Get all clinics
curl http://localhost:3000/api/clinics

# Get all doctors
curl http://localhost:3000/api/doctors

# Get all users
curl http://localhost:3000/api/users

# Create a clinic
curl -X POST http://localhost:3000/api/clinics \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Clinic","email":"test@clinic.com","phone":"123456","location":"Test Location"}'
```

---

## 📝 Development

### Adding New Routes

1. Create a new folder under `src/` (e.g., `src/patients/`)
2. Create three files:
   - `*.routes.ts` - Route definitions
   - `*.controller.ts` - Request handlers
   - `*.service.ts` - Business logic
3. Register the router in `src/app.ts`

### Database Changes

1. Update `prisma/schema.prisma`
2. Run migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

---
