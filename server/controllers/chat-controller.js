import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import Chat from "../models/chat.js";

export const accessChat = asyncHandler(async (request, response) => {
  const { userId } = request.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return response
      .status(400)
      .json({ message: "UserId param not sent with request" });
  }

  try {
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: request.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name username image email",
    });

    if (isChat.length > 0) {
      return response.json(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [request.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return response.status(200).json(FullChat);
    }
  } catch (error) {
    console.error("Error accessing chat:", error);
    return response.status(500).json({ message: "Error accessing chat." });
  }
});

export const fetchChats = asyncHandler(async (request, response) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: request.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    if (!chats) {
      return response.status(404).json({ message: "Chats not found." });
    }

    const populatedChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name username image email",
    });

    response.status(200).json(populatedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    response.status(500).json({ message: "Error fetching chats." });
  }
});

export const createTeam = asyncHandler(async (request, response) => {
  try {
    if (!request.body.users || !request.body.name) {
      return response
        .status(400)
        .json({ message: "Please fill all the fields." });
    }

    var users = JSON.parse(request.body.users);

    if (users.length < 2) {
      return response.status(400).json({
        message: "More than 2 users are required to form a group chat.",
      });
    }

    users.push(request.user);

    const groupChat = await Chat.create({
      chatName: request.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: request.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    response.status(200).json(fullGroupChat);
  } catch (error) {
    console.error("Error creating team:", error);
    response.status(500).json({ message: "Error creating team." });
  }
});

export const renameTeam = asyncHandler(async (request, response) => {
  const { chatId, chatName } = request.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return response.status(404).json({ message: "Chat not found." });
    }

    response.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error renaming team:", error);
    response.status(500).json({ message: "Error renaming team." });
  }
});

export const addToTeam = asyncHandler(async (request, response) => {
  const { chatId, userId } = request.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    response.status(404);
    throw new Error("Chat not found.");
  } else {
    response.status(200).json(added);
  }
});

export const removefromTeam = asyncHandler(async (request, response) => {
  const { chatId, userId } = request.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    response.status(404);
    throw new Error("Chat not found.");
  } else {
    response.status(200).json(removed);
  }
});
