import  express from 'express';
import { acceptSwap, cancelSwap, createSwap, getUserSwaps, rejectSwap } from '../controllers/swapController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/',verifyToken, createSwap);
router.post("/:id/accept",verifyToken, acceptSwap);
router.post("/:id/reject",verifyToken, rejectSwap);
router.post("/:id/cancel",verifyToken, cancelSwap);
router.get("/user/:userId",verifyToken, getUserSwaps);

export default router;