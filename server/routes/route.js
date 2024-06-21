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
  getAllUsers,
} from "../controllers/user-controller.js";
import upload from "../utils/upload.js";
import { uploadImage, getImage } from "../controllers/image-controller.js";
import {
  accessChat,
  addToTeam,
  createTeam,
  fetchChats,
  removefromTeam,
  renameTeam,
} from "../controllers/chat-controller.js";
import { allMessages, sendMessage } from "../controllers/message-controller.js";
import {
  addTask,
  completeTask,
  deleteTask,
  getTasks,
  markImportant,
} from "../controllers/task-controller.js";

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
router.get("/users", getAllUsers);

//task routes
router.post("/tasks/add", verifyUser, addTask);
router.delete("/tasks/delete/:taskId", verifyUser, deleteTask);
router.put("/tasks/complete/:taskId", verifyUser, completeTask);
router.put("/tasks/markImportant", verifyUser, markImportant);
router.get("/tasks/get", getTasks);

//chat/team routes
router.post("/chat", verifyUser, accessChat);
router.get("/chat/fetch", verifyUser, fetchChats);
router.post("/team", verifyUser, createTeam);
router.put("/team/rename", verifyUser, renameTeam);
router.put("/team/remove", verifyUser, removefromTeam);
router.put("/team/add", verifyUser, addToTeam);

//message routes
router.post("/message/send", verifyUser, sendMessage);
router.get("/message/:chatId", verifyUser, allMessages);

export default router;
