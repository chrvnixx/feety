import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import { connectDb } from "./src/config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port: ${port}`);
});
