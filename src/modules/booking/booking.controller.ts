import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async(req: Request, res: Response)=>{
    try{
        if(req.user?.role === 'customer'){
            req.body.customer_id = req.user.id
        }

        const result = await bookingService.createBookingIntoDB(req.body)

        res.status(201).json({
            success: true, 
            message: "Booking created successfully",
            data: result
        })
    }catch(error: any){
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error.message
        })
    }
}


const getAllBookings = async(req: Request, res: Response)=>{
    try{
        const result = await bookingService.getAllBookingsFromDB(req.user?.role as string, req.user?.id as number)

        res.status(200).json({
            success: true, 
            message: "Bookings retrieved successfully",
            data: result
        })
    }catch(error: any){
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error.message
        })
    }
}

const updateBooking = async(req: Request, res: Response)=>{
    try{
        const {bookingId} = req.params
        const{status} = req.body

        if(req.user?.role === 'customer' && status !== 'cancelled'){
            res.status(403).json({
                success: false,
                message: "Forbidden Access",
                errors: "Customers can only cancel their own bookings"
            })
            return;
        }

        if(req.user?.role === 'admin' && status === 'cancelled'){

        }

        const result = await bookingService.updateBookingIntoDB(bookingId as string, status)

        res.status(200).json({
            success: true, 
            message: status === 'cancelled' ? "Booking cancelled successfully": "Booking marked as returned. Vehicle is now available" ,
            data: result
        })
    }catch(error: any){
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error.message
        })
    }
}

export const bookingController = {
    createBooking, getAllBookings, updateBooking
}

