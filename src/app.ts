import express, {Request, Response} from "express"
import { authRoute } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { initDB } from "./database/db";

const app = express();

initDB();

app.use(express.json());

app.get('/', (req: Request, res: Response)=>{
    res.send({
        message: "Vehicle Rental System API is running"
    })
})

//Auth Routes
app .use("/api/v1/auth", authRoute);

//User Routes
app.use("/api/v1/users", userRoutes);

//Vehicle Routes
app.use("/api/v1/vehicles", vehicleRoutes);

//Booking Routes
app.use("/api/v1/bookings", bookingRoutes)

//Not FOund
app.use((req: Request, res: Response)=>{
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
})

export default app;
