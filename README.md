# DentaFlow Backend

Backend API for DentaFlow - A modern dental clinic management system built with Node.js, Express, TypeScript, and Prisma.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-black?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.x-blue?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql&logoColor=white)

---

## 🌐 Live API

| Service | URL |
|---------|-----|
| **Backend API** | [https://dentaflow-backend.vercel.app/](https://dentaflow-backend.vercel.app/) |
| **Health Check** | [https://dentaflow-backend.vercel.app/health](https://dentaflow-backend.vercel.app/health) |

---

## 📋 Features

- ✅ **Clinic Management** - Full CRUD operations for dental clinics
- ✅ **Doctor Management** - Public read access, admin write access
- ✅ **User Management** - Public read access with role-based data
- ✅ **Appointment Management** - Protected routes with authentication
- ✅ **Role-Based Access Control** - USER, ADMIN, DOCTOR roles
- ✅ **Secure Authentication** - Session-based auth with better-auth
- ✅ **Stripe Payment Integration** - Checkout sessions for appointments

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| Express | 5.x | Web framework |
| TypeScript | 5.x | Type safety |
| Prisma | 7.x | Database ORM |
| PostgreSQL | 15 | Database |
| better-auth | 1.5.x | Authentication |
| Stripe | Latest | Payment processing |
| Zod | 3.x | Input validation |

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
│   ├── payments/
│   │   ├── payments.routes.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── payments.schema.ts
│   ├── types/                 # TypeScript type definitions
│   ├── app.ts                 # Express app setup
│   └── seedAdmin.ts           # Admin user seeder
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database
- npm or yarn
- Git

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file with the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dentaflow"
   PORT=8000
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:8000"
   FRONTEND_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PRICE_ID="price_..."
   ```

4. **Setup database**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Create admin user**

   Sign up with the admin credentials:
   ```
   Email: admin@admin.com
   Password: Admin123!
   ```

   Then update the user role in the database:
   ```bash
   npx prisma studio
   ```

   Change the `role` field to `ADMIN`.

6. **Start the server**

   **Development:**
   ```bash
   npm run dev
   ```

   **Production:**
   ```bash
   npm run build
   npm start
   ```

   Backend will run on `http://localhost:8000`

---

## 📚 API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

---

### Authentication

All authentication endpoints are handled by **better-auth** under `/api/auth`

---

### Clinics (Public)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/clinics` | Get all clinics | ❌ |
| GET | `/api/clinics/:id` | Get clinic by ID | ❌ |
| POST | `/api/clinics` | Create new clinic | ❌ |
| PUT | `/api/clinics/:id` | Update clinic | ❌ |
| DELETE | `/api/clinics/:id` | Delete clinic | ❌ |

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

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/doctors` | Get all doctors | ❌ |
| GET | `/api/doctors/:id` | Get doctor by ID | ❌ |

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

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | ❌ |
| GET | `/api/users/:id` | Get user by ID | ❌ |

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

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/appointments` | Get all appointments | ✅ |
| GET | `/api/appointments/:id` | Get appointment by ID | ✅ |
| POST | `/api/appointments` | Create new appointment | ✅ |
| PUT | `/api/appointments/:id` | Update appointment | ✅ |
| DELETE | `/api/appointments/:id` | Cancel appointment | ✅ |

**Note:** All appointment endpoints require authentication via better-auth session.

---

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/payments` | Payments API health check | ❌ |
| POST | `/api/payments/create-payment` | Create Stripe checkout session | ❌ |

**Create Payment Request Body:**
```json
{
  "appointmentId": "appointment-id",
  "user": "user-id",
  "doctor": "doctor-id",
  "amount": 2000
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Notes:**
- Amount is in cents (e.g., 2000 = $20.00)
- The `appointmentId` must exist in the database (foreign key constraint)
- Redirect the user to the returned URL to complete payment
- Payment record is automatically created in the database upon session creation

---

## 🗄️ Database Schema

### Roles

- `USER` - Regular user (patients)
- `ADMIN` - Administrator with full access
- `DOCTOR` - Doctor role

### Key Models

**User**
- id, name, email, role, image, clinicId
- Relations: sessions, accounts, appointments

**Clinic**
- id, name, status, email, phone, location
- Relations: doctors, appointments

**Appointment**
- id, status (BOOKED/DONE/CANCELLED), date, userId, doctorId, clinicId
- Relation: payment

**Payment**
- id, stripeSessionId, amount, currency, status, createdAt
- Relation: appointment

---

## 🔐 Authentication

The application uses **better-auth** for session-based authentication.

### Protected Routes

To access protected routes (e.g., appointments), include the session token:

```bash
curl -H "Authorization: Bearer <session-token>" https://dentaflow-backend.vercel.app/api/appointments
```

### Auth Middleware

The `requireAuth` middleware from `src/lib/authMiddleware.ts` protects routes that need authentication.

---

## 🧪 Testing APIs

### Example Requests

```bash
# Health check
curl https://dentaflow-backend.vercel.app/health

# Get all clinics
curl https://dentaflow-backend.vercel.app/api/clinics

# Get all doctors
curl https://dentaflow-backend.vercel.app/api/doctors

# Get all users
curl https://dentaflow-backend.vercel.app/api/users

# Create a clinic
curl -X POST https://dentaflow-backend.vercel.app/api/clinics \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Clinic","email":"test@clinic.com","phone":"123456","location":"Test Location"}'

# Create a payment (appointment must exist)
curl -X POST https://dentaflow-backend.vercel.app/api/payments/create-payment \
  -H "Content-Type: application/json" \
  -d '{"appointmentId":"cmna0ubku00015li549faqj68","user":"user-id","doctor":"doctor-id","amount":2000}'
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

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `FRONTEND_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
4. Deploy

### Build Commands

```bash
npm run build
npm start
```

---

## 🔒 Security

- **Authentication:** better-auth with secure session management
- **Password Hashing:** Automatic hashing via better-auth
- **Environment Variables:** Sensitive data stored in `.env` files
- **CORS:** Configured for frontend-backend communication
- **Input Validation:** Zod schemas for all API inputs
- **Role-Based Access:** Middleware protection for admin routes

---

## 📞 Support

For any issues or questions:

- **Documentation:** Check this README
- **API Health:** `/health` endpoint
- **Issues:** GitHub repository issues

---

## 📄 License

This project is created for educational purposes as part of an assignment.

---

*Last Updated: March 31, 2026*
