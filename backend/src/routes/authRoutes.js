import express from "express";
import { login, refreshToken, signup } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signup", login);
router.post("/refresh", refreshToken)

export default router;
