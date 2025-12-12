import { Request, Response } from "express";
import { authServices } from "./auth.service";


const registerUser = async(req: Request, res: Response)=>{
  try{
    const result = await authServices.registerUserIntoDB(req.body)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
      }
    );
  }catch(error: any){
    res.status(400).json({
      success: false, 
      message: error.message, 
      errors: error.message 
    }
  );
  }
}

const loginUser = async(req : Request,res : Response)=>{
  try {
    const {email, password}= req.body
    const result = await authServices.loginUserIntoDB(req.body);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  }catch(error: any) {
    return res.status(404).json({
      success: false,
      message: "Login failed",
      errors: error.message
    });
  }
} 

export const authController = {
    loginUser, registerUser
}