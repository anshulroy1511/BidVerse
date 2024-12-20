import app from './app.js'
import cloudinary from "cloudinary"

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret : process.env.CLOUDINARY_SECRET,

})

app.listen(process.env.PORT,() =>{
    console.log(`Server listening on port ${process.env.PORT}`);
})