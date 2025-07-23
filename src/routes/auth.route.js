import express from 'express';
import { signup, login, logout, updateProfilePic, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile-pic", protectRoute, updateProfilePic);

router.get("/check", protectRoute, checkAuth);


export default router;