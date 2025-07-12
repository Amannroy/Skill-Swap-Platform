import  express from 'express';
import { getUserById, registerUser, searchUsers, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post("/register", registerUser);
router.get("/search", searchUsers);
router.get("/:id", getUserById);
router.put("/update/:id", updateUser);


export default router;