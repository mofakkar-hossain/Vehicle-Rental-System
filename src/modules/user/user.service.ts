import { pool } from "../../database/db";



const getAllUserFromDB = async()=>{
    const result = await pool.query(
    `
        SELECT id, name, email, phone, role FROM users
    `, 
    );

    return result.rows;
}

const updateUserIntoDB = async(id: string, payload: Record<string, unknown>)=>{
    const {name, email, phone, role} = payload

    const lowerCasedEmail = email?(email as string).toLowerCase(): undefined;
    
    const result = await pool.query(`
        UPDATE  users set name=COALESCE($1, name), email=COALESCE($2, email), phone=COALESCE($3, phone), role=COALESCE($4, role) WHERE id=$5 RETURNING id, name, email, phone, role
        `, [name, lowerCasedEmail, phone, role, id]);
    
    if(result.rows.length === 0){
        throw new Error("User not found")
    }    

    return result.rows[0]
}

const deleteUserFromDB = async(id: string)=>{
    const activeBooking = await pool.query(`
        SELECT * FROM bookings WHERE customer_id=$1 AND status='active'
        `, [id]);

    if(activeBooking.rows.length>0){
        throw new Error("Cannot delete user with active bookings")
    }
    
    const result = await pool.query(`
        DELETE FROM users WHERE id=$1 RETURNING id, name, email
        `, [id]);
    
    if(result.rows.length === 0){
        throw new Error("user not found")
    }

    return result.rows[0];
}

export const userServices = {
    getAllUserFromDB, updateUserIntoDB, deleteUserFromDB
}