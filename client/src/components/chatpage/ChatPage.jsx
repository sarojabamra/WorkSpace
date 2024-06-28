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
import ScrollableChat from "./scrollablechat/ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import { BiPoll } from "react-icons/bi";

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const ChatPage = ({ fetchAgain, setFetchAgain }) => {
  const [menuClick, setMenuClick] = useState(false);
  const { user: loggedUser } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const { selectedChat, chats, setChats, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleMenuClick = () => {
    setMenuClick(true);
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  console.log(setModalVisible);

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
        socket.emit("join chat", selectedChat._id);
      } else {
        console.log("There was an error fetching the messages.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", loggedUser);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await sendMessage(e);
    }
  };

  const handleButtonClick = async (e) => {
    await sendMessage(e);
  };

  const sendMessage = async (e) => {
    if ((e.type === "click" || e.key === "Enter") && (newMessage || file)) {
      socket.emit("stop typing", selectedChat._id);
      setNewMessage("");

      let fileMessage = null;

      if (file) {
        console.log("The file send to payload.", file); // file exists
        try {
          const formData = new FormData();
          formData.append("file", file);

          const fileResponse = await API.uploadFileInMessage(formData);
          console.log("File response: ", fileResponse.data);
          if (fileResponse.isSuccess) {
            fileMessage = {
              fileName: file.name,
              filePath: fileResponse.data,
            };
            console.log("Uploaded file successfully.");
          } else {
            console.log("Error uploading file:", fileResponse.error);
          }
        } catch (error) {
          console.log("Error uploading file:", error);
        }
      }

      try {
        const response = await API.sendMessage({
          content: newMessage,
          chatId: selectedChat._id,
          file: fileMessage,
        });
        if (response.isSuccess) {
          console.log(response.data);
          socket.emit("new message", response.data);
          setMessages([...messages, response.data]);
          setFetchAgain(!fetchAgain);
          setFile(null);
        }
      } catch (error) {
        console.log("Error sending message:", error);
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //typing indicator
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);
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
                        <div></div>
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
            fetchMessages={fetchMessages}
          />
          <div className="messages">
            <ScrollableChat
              messages={messages}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          </div>
          {isTyping ? (
            <Lottie
              options={defaultOptions}
              height={50}
              width={70}
              style={{ marginBottom: 15, marginLeft: 75 }}
            />
          ) : (
            <></>
          )}
          {file ? (
            <div className="file-selected">
              <span>File selected: </span>
              {file.name}
            </div>
          ) : (
            ""
          )}
          <div className="message-input">
            <div className="message-container">
              <div className="input">
                <input
                  type="file"
                  className="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div className="msg-icons">
                  <label htmlFor="fileInput">
                    <RiAttachment2
                      className={`msgbar-icon ${
                        file ? "file-exists" : "no-file"
                      }`}
                    />
                  </label>
                </div>
                <div className="input-container2">
                  <input
                    placeholder="Enter your message here..."
                    onChange={typingHandler}
                    value={newMessage}
                    onKeyDown={handleKeyPress}
                  />
                  <BiPoll className="msgbar-icon-poll" />
                </div>
              </div>
              <div className="send">
                <button className="send-btn" onClick={handleButtonClick}>
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
