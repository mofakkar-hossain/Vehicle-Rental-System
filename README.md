# 🚗 Vehicle Rental System API

A production-ready backend API for managing vehicle rental operations with secure authentication, role-based access control, and automated business logic.

## 🌐 Live Deployment

[https://vehicle-rental-system-topaz-delta.vercel.app/](https://vehicle-rental-system-topaz-delta.vercel.app/)

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 👥 **Role-Based Access Control** - Separate permissions for Admins and Customers
- 🚙 **Vehicle Management** - Complete CRUD operations for vehicle inventory
- 📅 **Smart Booking System** - Automated price calculation and availability tracking
- 🔄 **Auto-Return Logic** - Automatic booking status updates when rental period ends
- 🛡️ **Data Integrity** - Database-level constraints and application-level validations

### Business Logic
- Automatic total price calculation based on rental duration
- Real-time vehicle availability status management
- Prevents deletion of users/vehicles with active bookings
- Role-based data visibility (customers see only their bookings)
- Automated booking status updates for expired rentals

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon serverless)

### Security & Authentication
- **Password Hashing:** bcrypt
- **Authentication:** JSON Web Tokens (JWT)
- **Authorization:** Role-based middleware

### Development Tools
- **TypeScript Compiler:** tsc
- **Dev Server:** ts-node-dev (hot reload)
- **Type Definitions:** @types/node, @types/express, @types/jsonwebtoken, @types/pg

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **PostgreSQL** database (local or cloud-hosted)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/mofakkar-hossain/Vehicle-Rental-System.git
cd vehicle-rental-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=postgres://username:password@host:port/database?sslmode=require
JWT_ACCESS_SECRET=your_super_secret_jwt_key_here
JWT_ACCESS_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
```

**Configuration Details:**
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET` - Secret key for JWT token signing
- `JWT_ACCESS_EXPIRES_IN` - Token expiration time (e.g., 1d, 24h)
- `BCRYPT_SALT_ROUNDS` - Number of bcrypt hashing rounds (12 recommended)

### 4. Database Setup
The application automatically manages tables. Ensure your PostgreSQL database is accessible and the connection string is correct. You can also run the provided SQL initialization script if available.

**Tables created:**
- `users` - User accounts with authentication
- `vehicles` - Vehicle inventory
- `bookings` - Rental bookings with references

---

## 🚀 Usage Instructions

### Development Mode
Start the development server with hot-reload:
```bash
npm run dev
```
Server will start at `http://localhost:5000`

### Production Build
Compile TypeScript to JavaScript:
```bash
npm run build
npm start
```
Compiled files will be in the `dist/` directory.

### API Testing
Use tools like **Postman**, **Thunder Client**, or **cURL** to test endpoints.

**Base URL:** `http://localhost:5000/api/v1`

---

## 📚 API Documentation

### Authentication Endpoints

#### Register New User
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "phone": "01712345678",
  "address": "Dhaka, Bangladesh",
  "role": "customer"
}
```

#### User Login
```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePass123"
}
```

### Vehicle Endpoints

#### Get All Vehicles (Public)
```http
GET /api/v1/vehicles
```

#### Create Vehicle (Admin Only)
```http
POST /api/v1/vehicles
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

#### Update Vehicle (Admin Only)
```http
PUT /api/v1/vehicles/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

#### Delete Vehicle (Admin Only)
```http
DELETE /api/v1/vehicles/:id
Authorization: Bearer <jwt_token>
```

### Booking Endpoints

#### Create Booking (Authenticated Users)
```http
POST /api/v1/bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "vehicleId": 2,
  "startTime": "2024-01-15",
  "endTime": "2024-01-20"
}
```

#### Get All Bookings (Role-based)
```http
GET /api/v1/bookings
Authorization: Bearer <jwt_token>
```
- **Admin:** Sees all bookings with customer details
- **Customer:** Sees only their own bookings

#### Return Vehicle (Admin Only)
```http
PUT /api/v1/bookings/return
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "bookingId": 1,
  "endTime": "2024-01-20T10:00:00Z"
}
```

---

## 🏗️ Project Structure

```
vehicle-rental-system/
├── src/
│   ├── config/
│   │   └── index.ts               # Environment variables configuration
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.route.ts
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.route.ts
│   │   ├── vehicles/
│   │   │   ├── vehicle.controller.ts
│   │   │   ├── vehicle.service.ts
│   │   │   └── vehicle.route.ts
│   │   └── bookings/
│   │       ├── booking.controller.ts
│   │       ├── booking.service.ts
│   │       └── booking.route.ts
│   ├── middleware/
│   │   └── auth.ts                # JWT authentication & authorization
│   ├── database/
│   │   └── db.ts                  # Database connection & initialization
│   └── server.ts                  # Application entry point
├── .env                           # Environment variables (not in repo)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔒 Security Features

- **Password Security:** All passwords hashed using bcrypt with 12 salt rounds
- **JWT Authentication:** Secure token-based authentication with configurable expiration
- **Role-Based Access:** Granular permissions for admin and customer roles
- **Database Constraints:** Email uniqueness, foreign keys, data validation
- **No Password Exposure:** Passwords never included in API responses
- **Bearer Token Format:** Industry-standard authorization header format

---

## 📊 Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR | NOT NULL |
| email | VARCHAR | UNIQUE, NOT NULL |
| password | VARCHAR | NOT NULL |
| phone | VARCHAR | NOT NULL |
| role | VARCHAR | NOT NULL, 'customer' or 'admin' |
| address | TEXT | OPTIONAL |

### Vehicles Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| vehicle_name | VARCHAR | NOT NULL |
| type | VARCHAR | NOT NULL (car, bike, etc) |
| registration_number | VARCHAR | UNIQUE, NOT NULL |
| daily_rent_price | NUMERIC | NOT NULL, > 0 |
| availability_status | VARCHAR | NOT NULL, 'available' or 'booked' |

### Bookings Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| userId | INTEGER | FOREIGN KEY → users(id) |
| vehicleId | INTEGER | FOREIGN KEY → vehicles(id) |
| startTime | DATE | NOT NULL |
| endTime | DATE | NOT NULL |
| totalCost | NUMERIC | NOT NULL, > 0 |
| status | VARCHAR | 'active', 'cancelled', or 'returned' |

---

## 🔄 Business Rules

### Booking Price Calculation
```
totalCost = daily_rent_price × number_of_days
number_of_days = endTime - startTime
```

### Vehicle Availability Management
- **On Booking Creation:** Vehicle status → `booked`
- **On Booking Return:** Vehicle status → `available`

### Auto-Return System
- System automatically checks for expired bookings on each GET request
- Bookings with `endTime < current_date` are marked as `returned`
- Vehicle availability updated accordingly

### Deletion Protection
- Users with **active bookings** cannot be deleted
- Vehicles with **active bookings** cannot be deleted

---

## 🧪 Testing the API

### Example Flow

1. **Register a new customer:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"pass123","phone":"01712345678","role":"customer","address":"Dhaka"}'
```

2. **Login to get JWT token:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

3. **Get all vehicles:**
```bash
curl http://localhost:5000/api/v1/vehicles
```

4. **Create a booking (use token from login):**
```bash
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"vehicleId":1,"startTime":"2024-01-15","endTime":"2024-01-20"}'
```