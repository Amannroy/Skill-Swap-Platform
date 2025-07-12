import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
  photoUrl: String,
  isPublic: {
    type: Boolean,
    default: true,
  },
  skillsOffered: [{
    type: String,
    required: true,
  }],
  skillsWanted: [{
    type: String,
    required: true,
  }],
  availability: [{
    day: String,          // e.g., "Saturday"
    time: String          // e.g., "Evenings"
  }],
  isBanned: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

export const userModel = mongoose.model("users", userSchema);