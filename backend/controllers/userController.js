import { userModel } from "../models/User.js";
import bcrypt from "bcryptjs";

// Register a new user(Takes user info from the frontend. Saves it to MongoDB.)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, ...rest } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔒 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      ...rest,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user by ID(Takes the user_id from the URL. Finds that user in MongoDB and returns their profile.)
export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user by ID(Takes the user_id from the URL and updated data. Updates the user profile in the database.)
export const updateUser = async (req, res) => {
  try {
    const updated = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search user by skill or location (Takes skill and/or location from the search query (e.g. ?skill=React or ?location=Delhi). Finds public users who either: offer that skill (in skillsOffered) or want that skill (in skillsWanted) and optionally live in that location.)
export const searchUsers = async (req, res) => {
  const { skill, location } = req.query;
  try {
    const query = {
      isPublic: true,
      ...(skill && {
        $or: [
          { skillsOffered: { $regex: skill, $options: "i" } },
          { skillsWanted: { $regex: skill, $options: "i" } },
        ],
      }),
      ...(location && { location: { $regex: location, $options: "i" } }),
    };

    const results = await userModel.find(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
