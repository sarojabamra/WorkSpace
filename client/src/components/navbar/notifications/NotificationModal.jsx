import React from "react";
import { IoClose, IoNotifications } from "react-icons/io5";
import "./NotificationModal.css";
import { getSender } from "../../../utils/ChatLogic";
import { ChatState } from "../../../context/ChatProvider";
import { addElipses } from "../../../utils/common-utils";
import { FaCircle } from "react-icons/fa";

const NotificationModal = ({
  visible,
  onClose,
  notification,
  setNotification,
}) => {
  const { user, setSelectedChat } = ChatState();

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

  if (!visible) return null;
  return (
    <div>
      <div className="update-team">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="closediv">
              <IoClose className="close-icon" onClick={onClose} />
            </div>
            <div className="notif-title">
              <h2>Your Notifications!</h2>
            </div>
            <p className="email">
              Don't miss out on important updates and conversations. Click on
              the notification to view your message now.
            </p>
            <div className="notif-div">
              {!notification?.length && (
                <div className="notif-container">
                  <p className="email">
                    You're all caught up! No new notifications.
                  </p>
                </div>
              )}
              {notification?.map((notif) => (
                <div
                  className="notif-container"
                  key={notif?._id}
                  onClick={() => {
                    setSelectedChat(notif?.chat);
                    setNotification(notification?.filter((n) => n !== notif));
                    onClose();
                  }}
                >
                  {notif?.chat.isGroupChat ? (
                    <div className="notification">
                      <div>
                        <h4>{addElipses(notif?.content, 20)}</h4>
                        <p>
                          {addElipses(
                            `You received a new message in ${notif?.chat.chatName}`,
                            40
                          )}
                        </p>
                      </div>
                      <p className="time">
                        {formatUpdatedAt(notif?.updatedAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="notification">
                      <div>
                        <h4>{addElipses(notif?.content, 40)}</h4>
                        <p className="email">
                          {addElipses(
                            `You received a new message in ${getSender(
                              user,
                              notif?.chat.users
                            )}`,
                            40
                          )}
                        </p>
                      </div>
                      <p className="time">
                        {formatUpdatedAt(notif?.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
