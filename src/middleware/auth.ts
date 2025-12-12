import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { pool } from "../database/db"
import config from "../config"

const auth=(...roles: string[])=>{
    return async(req: Request, res: Response, next: NextFunction)=>{
    try{
         const tokenHeader = req.headers.authorization; 
        if(!tokenHeader)
        {
            res.status(401).json({
                success: false,
                message: "You are not authorized",
                errors: "No Token Provided"
            })
            return
        }
        const token = tokenHeader.split(" ")[1];
        const decoded = jwt.verify(token as string, config.jwt_secret) as JwtPayload
        const user = await pool.query(
            `
                SELECT * FROM users WHERE email=$1
            `, [decoded.email]
        )
        if(user.rows.length === 0){
            res.status(401).json({
                success: false,
                message: "User not found",
                errors: "User does not exist"
            })
            return
        }
        
        req.user = decoded

        if(roles.length && !roles.includes(decoded.role)){
            res.status(403).json({
                success: false,
                message: "Forbidden Access",
                errors: "Insufficient Permissions"
            })
            return;
        }

        next()
    } catch(error: any){
        res.status(401).json({
            success: false,
            message: "You are not authorized",
            errors: "Invalid or expired token"
        })
    }
}
}

export default auth