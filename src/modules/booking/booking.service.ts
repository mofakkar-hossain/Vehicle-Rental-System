import { pool } from "../../database/db"

const createBookingIntoDB = async(payload: Record<string, unknown>)=>{
    const {customer_id, vehicle_id, rent_start_date, rent_end_date} = payload

    const vehicleCheck = await pool.query(`
        SELECT daily_rent_price, availability_status, vehicle_name, registration_number, type 
        FROM vehicles WHERE id=$1
        `, [vehicle_id]);

    if(vehicleCheck.rows.length === 0){
        throw new Error("Vehicle not found");
    }

    const vehicle = vehicleCheck.rows[0];

    if(vehicle.availability_status !== 'available'){
        throw new Error("Vehicle is currently not available")
    }

    const startDate = new Date(rent_start_date as string);
    const  endDate = new Date(rent_end_date as string);
    const timeDiff = endDate.getTime() - startDate.getTime()
    const days = Math.ceil(timeDiff/(1000*3600*24));

    if(days<=0){
        throw new Error("Rent end date must be after start date")
    }

    const total_price = days*vehicle.daily_rent_price;

    const bookingResult = await pool.query(`
        INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *
        `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price])
    
    await pool.query(`
        UPDATE vehicles SET availability_status = 'booked' where id = $1
        `, [vehicle_id])
    
    const bookingResponse = bookingResult.rows[0];   
    
    return{
        ...bookingResponse, 
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    }
}

const getAllBookingsFromDB = async (userRole: string, userId: number) => {
    if (userRole === 'customer'){
        const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [userId]);
        
        const bookings = result.rows;
        const formattedBookings = [];
        const currentTime = new Date();

        for (const booking of bookings) {
            const endDate = new Date(booking.rent_end_date)
            if(booking.status === 'active' && currentTime>endDate){
                await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [booking.id]);
                await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
                booking.status = 'returned'
            }   
            
            const vehicle = (await pool.query(`
                SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1
                `, [booking.vehicle_id]
            )).rows[0];
            const { customer_id, ...bookingData } = booking;

            formattedBookings.push({
                ...bookingData,
                vehicle: {
                    vehicle_name: vehicle?.vehicle_name,
                    registration_number: vehicle?.registration_number,
                    type: vehicle?.type
                }
            });
        }
        return formattedBookings;
    }
    else if (userRole === 'admin') {
        const result = await pool.query(`SELECT * FROM bookings`);
        const bookings = result.rows;
        const formattedBookings = [];
        const currentTime = new Date();

        for (const booking of bookings) {
            const endDate = new Date(booking.rent_end_date);
            if (booking.status === 'active' && currentTime > endDate) {
                await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [booking.id]);
                await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
                booking.status = 'returned';
            }

            const vehicle = (await pool.query(
                `
                SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1
                `, [booking.vehicle_id]
            )).rows[0];

            const customer = (await pool.query(
                `SELECT name, email FROM users WHERE id=$1`, 
                [booking.customer_id]
            )).rows[0];

            formattedBookings.push({
                ...booking, 
                customer: {
                    name: customer?.name,
                    email: customer?.email
                },
                vehicle: {
                    vehicle_name: vehicle?.vehicle_name,
                    registration_number: vehicle?.registration_number,
                    type: vehicle?.type
                }
            });
        }
        return formattedBookings;
    }
}

const updateBookingIntoDB = async(bookingId: string, status: string) => {
    const bookingCheck = await pool.query(`SELECT vehicle_id, status, rent_start_date FROM bookings WHERE id=$1`, [bookingId])
    
    if(bookingCheck.rows.length === 0){
        throw new Error("Booking not found")
    }

    const {vehicle_id, status: currentStatus, rent_start_date} = bookingCheck.rows[0];

    if(currentStatus === 'returned' || currentStatus === 'cancelled'){
        throw new Error(`Booking is already ${currentStatus}`)
    }

    if(status === 'cancelled'){
        const startDate = new Date(rent_start_date);
        const now = new Date();
        if(now >= startDate){
            throw new Error("Cannot cancel a booking after the rent start date")
        }
    }

    const updatedBooking = await pool.query(`
        UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *
        `, [status, bookingId])

    if(status === "cancelled" || status === "returned"){
        await pool.query(`
            UPDATE vehicles SET availability_status='available' WHERE id=$1
            `, [vehicle_id])
    }

    if(status === "cancelled"){
        return updatedBooking.rows[0]; 
    }

    if(status === "returned"){
        return {
            ...updatedBooking.rows[0],
            vehicle: {
                availability_status: "available"
            }
        }
    }

    return updatedBooking.rows[0]
}


export const bookingService = {
    createBookingIntoDB, getAllBookingsFromDB, updateBookingIntoDB
}