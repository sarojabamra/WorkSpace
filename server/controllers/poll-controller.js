import asyncHandler from "express-async-handler";
import Poll from "../models/poll.js";
import Message from "../models/message.js";

export const createPoll = asyncHandler(async (req, res) => {
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

  res.status(200).json({ poll, message });
});

export const votePoll = asyncHandler(async (req, res) => {
  const { optionId, pollId } = req.body;
  const userId = req.user._id;
  console.log(userId);

  const poll = await Poll.findById(pollId);

  if (!poll) {
    res.status(404);
    throw new Error("Poll not found");
  }

  if (poll.votedBy.includes(userId)) {
    res.status(403);
    throw new Error("User has already voted");
  }

  const option = poll.options.id(optionId);
  if (!option) {
    res.status(404);
    throw new Error("Option not found");
  }

  option.votes += 1;
  poll.votedBy.push(userId);
  await poll.save();

  res.status(200).json(poll);
});

export const getPollById = async (req, res) => {
  const { id } = req.body;

  try {
    const poll = await Poll.findById(id)
      .populate("createdBy", "name")
      .populate("chat", "chatName");

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
