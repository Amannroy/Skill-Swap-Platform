import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  swap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'swaps',
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  message: {
    type: String,
    maxLength: 500
  }
}, { timestamps: true });

export const feedbackModel = mongoose.model("feedbacks", feedbackSchema);