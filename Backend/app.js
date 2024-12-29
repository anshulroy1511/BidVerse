// run backend :   cd backend  --> npm run dev

import { config } from "dotenv";
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js"
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js"
import commissionRouter from "./router/commissionRouter.js"
import superAdminRouter from "./router/superAdminRoutes.js"
import {endedAuctionCron} from "./automation/endedAuctionCron.js"
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";

const app = express();
config({
    path:"./config/config.env",
});

// // Add logging middleware for debugging
// app.use((req, res, next) => {
//     console.log("Request files:", req.files);  // Log files
//     console.log("Request body:", req.body);    // Log body data
//     next(); // Pass control to the next middleware or route handler
// });

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
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

endedAuctionCron();
verifyCommissionCron();

// //database connect
connection();
 
// error.js file 
app.use(errorMiddleware);

export default app;