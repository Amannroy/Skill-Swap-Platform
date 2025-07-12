import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  swap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap',
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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