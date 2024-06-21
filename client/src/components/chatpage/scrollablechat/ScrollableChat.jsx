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

const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = ChatState();

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
                          <div className="imgdiv3">
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
                        {message?.content}
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
