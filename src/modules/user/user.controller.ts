import { Request, Response } from "express"
import { userServices } from "./user.service";

const getAllUser = async(req: Request, res: Response)=>{
    try{
    const result = await userServices.getAllUserFromDB()
    return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result
        })
    }catch(error: any){
    return res.status(500).json({
        success: false,
        message: error.message,
        errors: error.message
        })
    }
}

const updateUser = async(req: Request, res: Response)=>{
    try{
        const {userId}= req.params;
        

        if(req.user?.role !== 'admin' && req.user?.id !== Number(userId)) {
            res.status(403).json({
                success: false,
                message: "Forbidden access",
                errors: "You are not authorized to update this profile"
            });
            return;
        }

        if(req.user?.role !== 'admin' && req.body.role){
            delete req.body.role;
        }

        const result = await userServices.updateUserIntoDB(userId as string, req.body)

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result
        })
    }catch(error: any){
        return res.status(404).json({
        success: false,
        message: "User not found",
        errors: error.message
        })
    }
}

const deleteUser = async (req: Request, res: Response)=>{
    const {userId} = req.params
    try{
        const result = await userServices.deleteUserFromDB(userId as string)
        
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }catch(error: any){
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error.message
        })
    }
}
export const userController = {
    getAllUser, updateUser, deleteUser
}