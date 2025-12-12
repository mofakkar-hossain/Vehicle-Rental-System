import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response)=>{
    try{
        const result = await vehicleService.createVehicleIntoDB(req.body);

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
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

const getAllVehicles = async (req: Request, res: Response)=>{
    try{
        const result = await vehicleService.getAllVehiclesFromDB();

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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

const getSingleVehicle = async (req: Request, res: Response)=>{
    try{
        const {vehicleId} = req.params
        const result = await vehicleService.getVehicleByIdFromDB(vehicleId as string);

        if(!result){
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
                errors: "Vehicle does not exist"
            })
            return
        }
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result
        })
    }catch(error: any){
        res.status(400).json({
            success: false,
            message: "Vehicle not found",
            errors: error.message
        })
    }
}

const updateVehicle = async(req: Request, res: Response)=>{
    try{
        const {vehicleId}= req.params;
        const result = await vehicleService.updateVehicleIntoDB(vehicleId as string, req.body)

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result
        })
    }catch(error: any){
        res.status(404).json({
            success: false,
            message: "Vehicle not found",
            errors: error.message
        })
    }
}

const deleteVehicle = async(req: Request, res: Response)=>{
    try{
        const {vehicleId} = req.params;
        const result = await vehicleService.deleteVehicleFromDB(vehicleId as string)

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        })
    }catch(error: any){
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error.message
        })
    }
}

export const vehicleController = {
    createVehicle, getAllVehicles, getSingleVehicle, updateVehicle, deleteVehicle
}