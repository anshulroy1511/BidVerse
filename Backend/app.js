import { config } from "dotenv";
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js"


const app = express();
config({
    path:"./config/config.env",
});

// use to connect frontend and backend by cors package
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
}));

// cookieparser middleware parses the cookies in incoming requests and makes them accessible via req.cookies
app.use(cookieParser());
app.use(express.json());
// middleware in Express.js that helps your app handle data sent from HTML forms.
app.use(express.urlencoded({extended: true}))
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
}));

//router connect
app.use("/api/v1/user", userRouter);

// database connect
connection();

// error.js file 
app.use(errorMiddleware)

export default app;