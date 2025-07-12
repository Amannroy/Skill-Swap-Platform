import  express from 'express';
import { getUserById, registerUser, searchUsers, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/register", registerUser);
router.get("/search",verifyToken, searchUsers);
router.get("/:id",verifyToken, getUserById);
router.put("/update/:id",verifyToken, updateUser);


export default router;