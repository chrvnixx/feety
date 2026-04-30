import express from "express";
import { login, signup } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signup", login);

export default router;
