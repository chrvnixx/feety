import express from "express"
import { getProducts } from "../controllers/productControllers.js"
import { adminRoute, protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/", protectRoute, adminRoute, getProducts)

export default router