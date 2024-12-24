import express from "express"
import { register , login , getProfile, logout, fetchLeaderboard } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// firsly isAuth , run means token is generated or not and then get profilee fun run
router.get("/me", isAuthenticated , getProfile);
router.get("/logout", isAuthenticated , logout);
router.get("/leaderboard", fetchLeaderboard);

export default router;