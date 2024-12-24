class ErrorHandler extends Error{
    constructor( message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}


// The errorMiddleware function handles specific errors and formats a consistent error response:
export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;

    if(err.name === "JsonWebTokenError"){
        const message = "Json web token is invalid, Try again"
        err= new ErrorHandler(message,404);
    }
    if(err.name === "TokenExpiredError"){
        const message = "Json web token is expired, Try again"
        err= new ErrorHandler(message,404);
    }
    if(err.name === "CastError"){
        const message = `Invalid ${err.path}` ;
        err= new ErrorHandler(message,404);
    }

    const errorMessage = err.errors
       ? Object.values(err.errors)
       .map(error => error.message)
       .join(" ")
    : err.message;

    return res.status(err.statusCode).json({
        success:false,
        message: errorMessage,
    });
};


// you have to declare it in the app.js   
export default ErrorHandler;