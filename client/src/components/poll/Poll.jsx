import React, { useEffect, useState } from "react";
import { API } from "../../service/api";
import "./Poll.css";

//Work in progress
const Poll = ({ pollId, sender }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [poll, setPoll] = useState({ question: "", options: [] });
  const [fetchAgain, setFetchAgain] = useState(false);

  const handleVote = async (option) => {
    console.log("Voting for option:", option._id);
    console.log("Poll ID:", pollId);
    try {
      const response = await API.votePoll({
        optionId: option._id,
        pollId: pollId,
      });
      console.log("response", response);
      if (response.isSuccess) {
        console.log("helo");
        setSelectedOption(option._id);
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {}
  };

  console.log("Poll id: ", pollId);

  const getPollById = async () => {
    try {
      const response = await API.getPollById({
        id: pollId,
      });
      if (response.isSuccess) {
        setPoll(response.data);
      } else {
        console.log("There was an error fetching the poll details.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPollById();
  }, [fetchAgain, pollId]);

  console.log("Poll details: ", sender);

  return (
    <div
      className={`poll-container ${sender === "sender" ? "sent" : "received"}`}
    >
      <h3 className="poll-question">{poll?.question}</h3>
      <ul className="poll-options">
        {poll?.options.map((option) => (
          <li
            key={option?._id}
            className={`poll-option ${
              selectedOption === option._id ? "selectedd" : ""
            }`}
          >
            <button
              onClick={() => handleVote(option)}
              className="option-button"
            >
              {option?.option}
            </button>
            <span className="vote-count">{option?.votes} votes</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Poll;
