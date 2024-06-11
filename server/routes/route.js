import express from "express";
import {
  signupUser,
  signinUser,
  forgotPassword,
  resetPassword,
  verifyUser,
  verifyAuthentication,
  userLogout,
  getUserById,
  updateProfileById,
} from "../controllers/user-controller.js";
import upload from "../utils/upload.js";
import { uploadImage, getImage } from "../controllers/image-controller.js";

const router = express.Router();

router.post("/auth/signup", signupUser);
router.post("/auth/signin", signinUser);
router.post("/auth/forgotPassword", forgotPassword);
router.post("/auth/resetPassword", resetPassword);
router.get("/auth/verify", verifyUser, verifyAuthentication);
router.get("/auth/logout", userLogout);
router.get("/user/details/:id", getUserById);
router.put("/user/update/:id", updateProfileById);
router.post("/file/upload", upload.single("file"), uploadImage);
router.get("/file/:filename", getImage);

export default router;
