import {pool} from "../../database/db"


const createVehicleIntoDB = async(payload: Record<string, unknown>)=>{
    const{vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload

    const result = await pool.query(`
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)   VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    
    return result.rows[0];
}

const getAllVehiclesFromDB = async()=>{
    const result = await pool.query(` SELECT * FROM vehicles`);
    return result.rows;
}

const getVehicleByIdFromDB = async(id: string)=>{
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    return result.rows[0];
}

const updateVehicleIntoDB = async(id: string, payload: Record<string, unknown>)=>{
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload
    const result = await pool.query(`
        UPDATE vehicles SET vehicle_name = COALESCE($1, vehicle_name), type = COALESCE($2, type), registration_number = COALESCE($3, registration_number), daily_rent_price = COALESCE($4, daily_rent_price), availability_status = COALESCE($5, availability_status) WHERE id = $6 RETURNING *
        `, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);

    if(result.rows.length === 0){
        throw new Error("Vehicle not found")
    }
    
    return result.rows[0];
}

const deleteVehicleFromDB = async(id: string)=>{
    const activeBookings = await pool.query(`
        SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'
        `, [id]);
    if(activeBookings.rows.length > 0 ){
        throw new Error("Cannot delete vehicle with active bookings");
    }

    const result = await pool.query(`
        DELETE FROM vehicles WHERE id=$1 RETURNING *
        `, [id]);
    if(result.rows.length === 0){
        throw new Error("Vehicle not found");
    }

    return result.rows[0];
}

export const vehicleService = {
    createVehicleIntoDB, getAllVehiclesFromDB, getVehicleByIdFromDB, updateVehicleIntoDB, deleteVehicleFromDB
}