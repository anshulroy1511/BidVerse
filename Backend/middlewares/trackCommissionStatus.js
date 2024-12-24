import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsuncError.js";
import ErrorHandler from "./error.js";

export const trackCommissionStatus = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.user._id);
    if(user.unpaidCommission > 0 )
    {
        return next (new ErrorHandler("You have unpaid commission, please clear it .", 403));
    }
    next();
});