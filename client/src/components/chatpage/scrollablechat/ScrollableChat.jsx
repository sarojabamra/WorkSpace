import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isFirstMessage,
  isLastMessage,
  isSameSender,
  isSameUser,
} from "../../../utils/ChatLogic";
import { ChatState } from "../../../context/ChatProvider";
import "./ScrollableChat.css";
import { API } from "../../../service/api";
import { Link } from "react-router-dom";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { FaFileAlt } from "react-icons/fa";

const ScrollableChat = ({ messages, fetchAgain, setFetchAgain }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const accessChat = async (userId) => {
    try {
      const response = await API.accessChat({ userId });

      if (response.isSuccess) {
        if (!chats.find((c) => c._id === response.data._id)) {
          setChats([response.data, ...chats]);
        }
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFileExtension = (filename) => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1] : "";
  };

  return (
    <div className="scrollable-feed-container">
      <ScrollableFeed className="scrollable-feed">
        <div className="scroll-container">
          {Array.isArray(messages) && messages.length > 0 ? (
            <div className="m-container">
              <div className="messages-container">
                {messages.map((message, i) => {
                  const sameSender = isSameSender(
                    messages,
                    message,
                    i,
                    user._id
                  );
                  //const lastMessage = isLastMessage(messages, i, user._id);
                  const sameUser = isSameUser(messages, message, i, user._id);
                  const firstMessage = isFirstMessage(messages, i, user._id);

                  const isCurrentUser = message.sender._id === user._id;
                  const messageWrapperClass = `message-wrapper ${
                    message.sender._id === user._id
                      ? "sender-wrapper"
                      : "receiver-wrapper"
                  } `;

                  let marginTop = "0px";
                  if (firstMessage && !isCurrentUser) {
                    marginTop = "25px"; // Margin-top for the first message of sender
                  } else if (!sameUser) {
                    marginTop = "10px"; // Default margin-top for other messages
                  }

                  return (
                    <div className={messageWrapperClass} key={message._id}>
                      {firstMessage && !isCurrentUser && (
                        <div className="message-info">
                          <div
                            className="imgdiv3"
                            onClick={() => accessChat(message?.sender._id)}
                          >
                            <img
                              src={
                                message?.sender.image
                                  ? message?.sender.image
                                  : "../../../images/profile-photo.jpg"
                              }
                              alt="sender"
                            />
                          </div>
                          <span className="sender-name">
                            {message?.sender.name}
                          </span>
                        </div>
                      )}

                      <span
                        className={
                          message?.sender._id === user._id
                            ? "sender"
                            : "receiver"
                        }
                        style={{
                          marginTop: marginTop,
                        }}
                      >
                        {message?.file ? (
                          <div>
                            <div className="file">
                              <div className="filename">
                                <p className="name">{message.file.fileName}</p>
                                <p className="email">
                                  .{getFileExtension(message.file.fileName)}{" "}
                                  file <span>• Download</span>
                                </p>
                              </div>
                              <Link to={message.file.filePath}>
                                <PiDownloadSimpleBold className="download-icon" />
                              </Link>
                            </div>
                            <p className="file-message">{message.content}</p>
                          </div>
                        ) : (
                          <div>{message?.content}</div>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;
