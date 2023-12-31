import { Router } from "express";
import {
  register,
  login,
  logout,
  Getprofile,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedIn, Getprofile);

export default router;
