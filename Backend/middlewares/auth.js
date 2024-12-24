import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { catchAsyncErrors } from "./catchAsuncError.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    console.log("Cookies: ", req.cookies);

    const token = req.cookies.token;
    if (!token) {
        return next(new ErrorHandler("user not authenticated", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded Token: ", decoded);

        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return next(new ErrorHandler("User not found", 404));
        }
        next();
    } catch (error) {
        console.error("JWT Error: ", error);
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
});

// export const isAuthenticated = catchAsyncErrors(async(req,res,next) => {
//     console.log("Cookies: ", req.cookies);

//    const token = req.cookies.token;                               
   
//    if(!token){
//     return next(new ErrorHandler("user not authenticated", 400));
//    }
   
//    const decoded =  jwt.verify(token, process.env.JWT_SECRET_KEY);
//    req.user = await User.findById(decoded.id);
//    next(); 
// });


export const isAuthorized = (...roles) => {
    return(req,res,next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `${req.user.role} not allowed to access this role`,
                    403
                )
            );
        }
        next();                                      
    };              
}