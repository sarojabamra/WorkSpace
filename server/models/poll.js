import mongoose from "mongoose";

const pollOptionSchema = new mongoose.Schema({
  option: String,
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [pollOptionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;
