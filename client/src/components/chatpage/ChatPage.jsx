import React, { useEffect } from "react";
import "./ChatPage.css";
import { FaUser } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { RiAttachment2 } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import UserModal from "./usermodal/UserModal";
import { ChatState } from "../../context/ChatProvider";
import { API } from "../../service/api";
import { RiTeamLine } from "react-icons/ri";
import { useUser } from "../../context/UserContext";
import {
  getSender,
  getSenderImage,
  getSenderUsername,
} from "../../utils/ChatLogic";
import { addElipses } from "../../utils/common-utils";
import UpdateTeamModal from "./updateTeam/UpdateTeamModal";

const ChatPage = ({ fetchAgain, setFetchAgain }) => {
  const [menuClick, setMenuClick] = useState(false);
  const { user: loggedUser } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const { selectedChat, chats, setChats } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();

  const handleMenuClick = () => {
    setMenuClick(true);
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleTeamModalOpen = () => {
    setTeamModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleTeamModalClose = () => {
    setTeamModalVisible(false);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const response = await API.getAllMessages(selectedChat);
      if (response.isSuccess) {
        setMessages(response.data);
      } else {
        console.log("There was an error fetching the messages.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(messages);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      setNewMessage("");
      try {
        const response = await API.sendMessage({
          content: newMessage,
          chatId: selectedChat._id,
        });
        if (response.isSuccess) {
          console.log(response.data);
          setMessages([...messages, response.data]);
        }
      } catch (error) {}
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //typing indicator
  };

  const url = getSenderImage(loggedUser, selectedChat?.users)
    ? getSenderImage(loggedUser, selectedChat?.users)
    : "../../../images/profile-photo.jpg";
  return (
    <div className="chat-pagediv">
      {selectedChat ? (
        <>
          <div className="name-container">
            <div className="name-div">
              <div className="user-imgdiv">
                <img src={url} />
              </div>
              <div>
                <p className="name">
                  {selectedChat?.isGroupChat
                    ? selectedChat?.chatName
                    : getSender(loggedUser, selectedChat?.users)}
                </p>
                <p className="username">
                  {selectedChat?.isGroupChat ? (
                    <div className="row">
                      {Array.isArray(selectedChat.users) &&
                      selectedChat.users.length > 0 ? (
                        <div>
                          {addElipses(
                            selectedChat.users
                              .map((user) => user.name)
                              .join(", "),
                            50
                          )}
                        </div>
                      ) : (
                        <div>No chats available</div>
                      )}
                    </div>
                  ) : (
                    getSenderUsername(loggedUser, selectedChat?.users)
                  )}
                </p>
              </div>
            </div>
            <div className="icons">
              {selectedChat?.isGroupChat ? (
                <RiTeamLine
                  className="userinfo-icon"
                  onClick={handleTeamModalOpen}
                />
              ) : (
                <FaRegUserCircle
                  className="userinfo-icon"
                  onClick={handleModalOpen}
                />
              )}

              <SlOptionsVertical
                className="options-icon"
                onClick={() => handleMenuClick()}
              />
              {menuClick && <div></div>}
            </div>
          </div>
          <UpdateTeamModal
            visible={teamModalVisible}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            onClose={handleTeamModalClose}
          />
          <div className="messages">
            {Array.isArray(messages) && messages.length > 0 ? (
              <div>
                {messages.map((message) => (
                  <div>
                    <p>{message.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="message-input">
            <div className="message-container">
              <div className="input">
                <RiAttachment2 className="msgbar-icon" />
                <div className="input-container2">
                  <input
                    placeholder="Enter your message here..."
                    onChange={typingHandler}
                    value={newMessage}
                    onKeyDown={sendMessage}
                  />
                  <BsEmojiSmile className="msgbar-icon-emoji" />
                </div>
              </div>
              <div className="send">
                <button className="send-btn">
                  <IoIosSend className="msgbar-icon" />
                </button>
              </div>
            </div>
          </div>

          <UserModal
            visible={modalVisible}
            onClose={handleModalClose}
            selectedChat={selectedChat}
          />
        </>
      ) : (
        <div className="nochat-selected">
          <div className="nochat-msg">
            <p className="email">
              Please select a chat or team from the sidebar to start messaging.
              If you don't see any chats or teams, try creating a new one to get
              started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
