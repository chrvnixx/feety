import express from "express";
import {
  checkAuth,
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token",  refreshToken);
router.get("/check-auth", protectRoute, checkAuth);

export default router;
