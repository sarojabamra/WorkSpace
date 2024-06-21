import asyncHandler from "express-async-handler";
import Message from "../models/message.js";
import User from "../models/user.js";
import Chat from "../models/chat.js";

export const sendMessage = asyncHandler(async (request, response) => {
  const { content, chatId } = request.body;

  if (!content || !chatId) {
    console.log("Invalid data passed as request.");
  }

  var newMessage = {
    sender: request.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name image email",
    });

    await Chat.findByIdAndUpdate(request.body.chatId, {
      latestMessage: message,
    });

    response.status(200).json(message);
  } catch (error) {
    response.status(500);
    throw new Error(error.message);
  }
});

export const allMessages = asyncHandler(async (request, response) => {
  try {
    const messages = await Message.find({ chat: request.params.chatId })
      .populate("sender", "name image email")
      .populate("chat");

    response.status(200).json(messages);
  } catch (error) {
    response.status(500);
    throw new Error(error.message);
  }
});
