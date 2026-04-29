import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import { saveRefreshToken, setCookies } from "../utils/saveRefreshToken.js";

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

    const { accessToken, refreshToken } = generateToken(user._id);
    saveRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "user created",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
    console.log("Error in signup controller", error);
  }
}