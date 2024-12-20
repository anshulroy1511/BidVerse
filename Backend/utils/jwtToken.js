export const  generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();  // from userSchema 
    res
    .status(statusCode)
    .cookie("anshul", token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
    }).json({
        success: true,
        message,
        user,
        token,
    });
};