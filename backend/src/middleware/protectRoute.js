import jwt from "jsonwebtoken";
import User from "../models/user.js";

export async function protectRoute(req, res, next) {
  const accessToken = req.cookies.accessToken;
  try {
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorised - no access token" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorised - invalid token" });
    }

    req.userId = decoded.userId;
    console.log(req.userId);

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
    console.log("Error in protectRoute middleware", error);
  }
}

export async function adminRoute(req, res, next) {
  const userId = req.userId;
  try {
    const user = await User.findById({ userId });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (user.role != "admin") {
      return res.status(400).json({ message: "Unauthorised - Admin only" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
    console.log("Error in adminRoute controller", error);
  }
}
