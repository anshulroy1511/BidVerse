import { catchAsyncErrors } from "./catchAsuncError.js";
import mongoose from "mongoose";
import ErrorHandler from "./error.js";
import { Auction } from "../models/auctionSchema.js";

export  const checkAuctionEndTime = catchAsyncErrors(async(req,res,next) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return next(new ErrorHandler("Invalid ID format", 400 ));
    }
    const auction = await Auction.findById(id);
    if(!auction) {
        return next(new ErrorHandler("Auction not found", 404));
    }
    const now = new Date();
    if(new Date(auction.startTime) > now){
        return next(new ErrorHandler("auction has not started yet",400 ));
    }
    if(new Date(auction.endTime) < now){
        return next(new ErrorHandler("auction is ended ",400 ));
    }
    next();
});