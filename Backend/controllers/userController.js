import {catchAsyncErrors} from "../middlewares/catchAsuncError.js"
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary"
import { generateToken } from "../utils/jwtToken.js";

export const register =  catchAsyncErrors(async(req, res , next) => {
    if(!req.files || Object.keys(req.files).length ===0 ){
        
        // handle error by error handler-----------
        return next(new ErrorHandler("profile image is required"), 400);
        // return res.status(400).json({
        //     success:false,
        //     message:"profile image is required "
        // });
    }

    const {profileImage} = req.files;

    const allowedFormats = ["image/png", "image/jpeg" , "image/webp"];
    if(!allowedFormats.includes(profileImage.mimetype)){
        return next(new ErrorHandler("File format is not supported", 400))
    }

    // access the data
    const {
        userName, 
        email,
        password,
        phone,
        address,
        role, 
        bankAccountNumber,
        bankAccountName,
        bankName,
        razorpayAccountNumber,
        paypalEmail
    }  = req.body;

    if(!userName || !email || !password || !phone || !address || !role) {
        return next(new ErrorHandler("Please fill full form", 400));
    }
    if(role === "Auctioneer"){
        if(!bankAccountName || !bankAccountNumber || !bankName){
            return next(
                new ErrorHandler("Please provie your full bank details", 400)
            );
        }
        if(! razorpayAccountNumber){
            return next(
                new ErrorHandler("Please provie your  razorpay Account Number", 400)
            );
        }
        if(!paypalEmail){
            return next(
                new ErrorHandler("Please provie your paypal email", 400)
            );
        }
      
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler("user already reistered", 400));
    }
   const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
    folder: "MERN_AUCTION_PLATFORM_USERS",
   }
   );
   
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary error: ", 
            cloudinaryResponse.error || "unknown cloudinary error"
        );
        return next(new ErrorHandler("Failed to upload profile image to cloudinary", 500)
    );
    }

    const user = await User.create({
        userName, 
        email,
        password,
        phone,
        address,
        role,
        profileImage: {
            piblic_id : cloudinaryResponse.public_id,
            url : cloudinaryResponse.secure_url,
        },
        paymentMethods : {
            bankTransfer:{
                bankAccountNumber,    
                bankAccountName,
                bankName,
            },
            razorpay: {
                razorpayAccountNumber ,
            },
            paypal: {
                paypalEmail ,
            },
        },
    });

    generateToken(user,"User Registered",201, res )
    
});