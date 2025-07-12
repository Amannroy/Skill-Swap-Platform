import { io } from "../index.js";
import { swapModel } from "../models/Swap.js";
import { userModel } from "../models/User.js";

// 📨 Send a new swap request
export const createSwap = async (req, res) => {
  try {
    const { fromUser, toUser } = req.body;

    // Prevent self-swap
    if (fromUser === toUser) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // Check for existing pending swap
    const existing = await swapModel.findOne({ fromUser, toUser, status: "pending" });
    if (existing) {
      return res.status(400).json({ message: "Swap already requested" });
    }

    // Save new swap
    const swap = new swapModel({ fromUser, toUser });
    await swap.save();

    // 🔔 Emit real-time event to receiver (toUser)
    io.to(toUser).emit("newSwapRequest", {
      fromUser,
      swapId: swap._id,
    });

    res.status(201).json({ message: "Swap request sent", swap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Accept a swap
export const acceptSwap = async (req, res) => {
  try {
    const swap = await swapModel.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    swap.status = "accepted";
    await swap.save();
    res.json({ message: "Swap accepted", swap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Reject a swap
export const rejectSwap = async (req, res) => {
  try {
    const swap = await swapModel.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    swap.status = "rejected";
    await swap.save();
    res.json({ message: "Swap rejected", swap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Cancel a swap
export const cancelSwap = async (req, res) => {
  try {
    const swap = await swapModel.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    swap.status = "cancelled";
    await swap.save();
    res.json({ message: "Swap cancelled", swap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get all swaps related to a user
export const getUserSwaps = async (req, res) => {
  try {
    const userId = req.params.userId;

    const swaps = await swapModel.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate("fromUser", "name skillsOffered")
      .populate("toUser", "name skillsWanted")
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
