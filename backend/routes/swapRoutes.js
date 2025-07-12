import  express from 'express';
import { acceptSwap, cancelSwap, createSwap, getUserSwaps, rejectSwap } from '../controllers/swapController.js';

const router = express.Router();

router.post('/', createSwap);
router.post("/:id/accept", acceptSwap);
router.post("/:id/reject", rejectSwap);
router.post("/:id/cancel", cancelSwap);
router.get("/user/:userId", getUserSwaps);

export default router;