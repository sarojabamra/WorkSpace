import asyncHandler from "express-async-handler";
import Poll from "../models/poll.js";
import Message from "../models/message.js";

const createPoll = asyncHandler(async (req, res) => {
  const { question, options, chatId } = req.body;

  if (!question || !options || !chatId) {
    res.status(400);
    throw new Error("Please provide all the required fields");
  }

  const poll = await Poll.create({
    question,
    options: options.map((option) => ({ option })),
    createdBy: req.user._id,
    chat: chatId,
  });

  const message = await Message.create({
    sender: req.user._id,
    chat: chatId,
    poll: poll._id,
  });

  res.status(201).json({ poll, message });
});

const votePoll = asyncHandler(async (req, res) => {
  const { optionId } = req.body;
  const poll = await Poll.findById(req.params.id);

  const option = poll.options.id(optionId);
  if (!option) {
    res.status(404);
    throw new Error("Option not found");
  }

  option.votes += 1;
  await poll.save();

  res.status(200).json(poll);
});
