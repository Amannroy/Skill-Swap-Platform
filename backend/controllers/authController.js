import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";

// 🧠 User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Find user by email
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 🔒 Compare password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid credentials" });

    // 🔑 Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    // ✅ Remove password before sending
    const { password: pwd, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
