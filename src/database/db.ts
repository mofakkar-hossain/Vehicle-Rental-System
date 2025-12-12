import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString : config.connection_string 
});

export const initDB = async() => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL CHECK (email=LOWER(email)),
      password varchar(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role VARCHAR(20) CHECK (role in ('admin', 'customer')) NOT NULL DEFAULT 'customer'
    );  
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(50) NOT NULL,
      type VARCHAR(50) CHECK(type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price  INT NOT NULL CHECK(daily_rent_price > 0),
      availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) NOT NULL DEFAULT 'available'
    );
    `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id) ,
      vehicle_id INT REFERENCES vehicles(id) ,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price INT NOT NULL CHECK(total_price > 0),
      status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) NOT NULL DEFAULT 'active',
      CHECK (rent_end_date  > rent_start_date)
    );
    `);
    console.log("Database Connected");
}

