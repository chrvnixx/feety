import { redis } from "../config/upstash.js";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import { saveRefreshToken, setCookies } from "../utils/saveRefreshToken.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, fullName, username, password } = req.body;
  try {
    if (!email || !fullName || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000);

    const user = new User({
      email,
      fullName,
      username,
      password,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000,
    });

    await user.save();

    res.status(201).json({
      message: "user created",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
    console.log("Error in signup controller", error);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const user = User.findOne({ email });

    if (user && user.comparePassword) {
      const { accessToken, refreshToken } = generateToken(user._id);
      saveRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        message: "logged in successfully",
        user: { ...user._doc, password: undefined },
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
    console.log("Error in login controller", error);
  }
}

export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "user logged out" });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
    console.log("Error in logout controller", error);
  }
}

export async function resetPassword(req,res){
  const {email,password} = req.body
  try {
   const user = await User.findOne({email})

   if(!user){
    return res.status(404).json({message:"user not found"})
   }

   if(password === user.password){
    return res.status(400).json({message:"Can't use an old password"})
   }

   user.password = password

   await user.save()

   res.status(200).json({message:"password reset successfull"})

  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
    console.log("Error in resetPassword controller", error);
  }
}
