import bcrypt from "bcryptjs";
import { pool } from "../../database/db";
import jwt from "jsonwebtoken"
import config from "../../config";


export const registerUserIntoDB = async(payload: Record<string, unknown>)=>{
    const {name, email, password, phone, role} = payload;

    const existingUser = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email]);
    if(existingUser.rows.length>0){
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password as string, 12)

    const result = await pool.query(`
        INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role
    `, [name, email, hashedPassword, phone, role]
    );
    return result.rows[0];
}

export const loginUserIntoDB = async (payload: Record<string, unknown>) => {
    const {email, password}= payload;
    const user = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email]
    );

    if(user.rows.length === 0){
        throw new Error("User not found")
    }

    const mathPassword = await bcrypt.compare(password as string, user.rows[0].password)
    if(!mathPassword){
        throw new Error("Invalid Credentials")
    }
    
    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
    }

const token = jwt.sign(jwtPayload, config.jwt_secret , {expiresIn: "7d"});
delete user.rows[0].password

return {token, user: user.rows[0]};
};

export const authServices = {
  loginUserIntoDB,registerUserIntoDB
};