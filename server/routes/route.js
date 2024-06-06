import express from "express";
import { signupUser } from "../controllers/user-controller.js";

const router = express.Router();

router.post("/auth/signup", signupUser);

export default router;
