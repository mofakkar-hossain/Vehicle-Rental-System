# Vehicle Rental System

A robust backend API for a car rental platform. This system handles user authentication, vehicle management, and booking transactions with automated logic for price calculation and vehicle availability.

**Live Deployment:** https://vehicle-rental-system-topaz-delta.vercel.app/

## Features

* **User Authentication:** Secure Signup and Login using JWT.
* **Role-Based Access:** Distinct permissions for Admin (manage inventory) and Customer (book vehicles).
* **Vehicle Management:** Admin capabilities to add, update, and delete vehicles with real-time availability tracking.
* **Automated Booking:** Instant price calculation based on rental duration and logic to prevent conflicting bookings.
* **Auto-Return System:** Automatically marks bookings as returned and vehicles as available when the rental period expires.
* **Data Integrity:** Prevents deletion of users or vehicles active in ongoing bookings.

## Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (hosted on Neon)
* **Deployment:** Vercel

## Setup & Usage Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/mofakkar-hossain/Vehicle-Rental-System.git
cd vehicle-rental-system