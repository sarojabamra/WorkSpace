import React, { useEffect } from "react";
import { ChatState } from "../../../context/ChatProvider";
import "./ChatItem.css";
import { getSender, getSenderImage } from "../../../utils/ChatLogic";
import { addElipses } from "../../../utils/common-utils";

const ChatItem = ({ chat }) => {
  const { selectedChat, user: loggedUser } = ChatState();

  const url = getSenderImage(loggedUser, chat?.users)
    ? getSenderImage(loggedUser, chat?.users)
    : "../../../images/profile-photo.jpg";

  function formatUpdatedAt(updatedAt) {
    const updatedDate = new Date(updatedAt);
    const now = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = now - updatedDate;
    // Convert milliseconds to days
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (dayDifference < 1) {
      // If less than a day, return the time in HH:MM format without space before AM/PM
      let timeString = updatedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      // Remove space before AM/PM
      timeString = timeString.replace(" ", "");
      return timeString;
    } else {
      // If a day or more, return the date in MM-DD format
      const month = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
      const day = ("0" + updatedDate.getDate()).slice(-2);
      return `${month}-${day}`;
    }
  }

  return (
    <div>
      <div className="userbg">
        <div
          className={
            selectedChat?._id === chat?._id
              ? "user-container3 selected"
              : "user-container3"
          }
        >
          <div className="column1">
            <div className="user-imgdiv">
              <img src={url} />
            </div>
            <div>
              <p className="name">
                {!chat?.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat?.chatName}
              </p>

              <p className="email">
                {chat?.latestMessage?.sender.name && (
                  <span>{chat?.latestMessage?.sender.name}: </span>
                )}
                {addElipses(chat?.latestMessage?.content, 20)}
              </p>
            </div>
          </div>
          <div className="column2">
            <p className="date">{formatUpdatedAt(chat?.updatedAt)}</p>
          </div>
        </div>
        <div className="hr2" />
      </div>
    </div>
  );
};

export default ChatItem;
