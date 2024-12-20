// handle asynchronous errors in middleware or route handlers.
export const catchAsyncErrors = (theFunction) => {
    return (req,res,next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next);
    };
};