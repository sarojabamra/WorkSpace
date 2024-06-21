import React, { useState, useEffect } from "react";
import "./ChatList.css";
import { API } from "../../service/api";
import { IoChevronBackCircle } from "react-icons/io5";
import User from "./user/User";
import { IoIosAddCircle } from "react-icons/io";
import { ChatState } from "../../context/ChatProvider";
import { useUser } from "../../context/UserContext";
import ChatItem from "./chats/ChatItem";
import CreateTeamModal from "./createteam/CreateTeamModal";
import ScrollableFeed from "react-scrollable-feed";

const ChatList = ({ isSearching, isUserSearching, fetchAgain }) => {
  const [users, setUsers] = useState([]);
  const { user: loggedUser } = useUser();
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);

  const { selectedChat, setSelectedChat, chats, setChats, searchQuery } =
    ChatState();

  const filterUsers = (user) => {
    if (user._id === loggedUser._id) {
      return false;
    }
    if (!searchQuery) {
      return true;
    }
    const userMatch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return userMatch;
  };

  useEffect(() => {
    if (isSearching) {
      const fetchData = async () => {
        try {
          let response = await API.getAllUsers();
          if (response.isSuccess) {
            setUsers(response.data);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchData();
    }
  }, [isSearching]);

  const backToChats = () => {
    isUserSearching(false);
  };

  const accessChat = async (userId) => {
    try {
      const response = await API.accessChat({ userId });

      if (response.isSuccess) {
        if (!chats.find((c) => c._id === response.data._id)) {
          setChats([response.data, ...chats]);
        }
        setSelectedChat(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChats = async () => {
    const response = await API.fetchChats();
    if (response.isSuccess) {
      setChats(response.data);
    } else {
      console.log("Error fetching chats.");
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="chat-list-box">
      <div className="chat-list">
        {isSearching && (
          <div>
            <button className="back" onClick={() => backToChats()}>
              <IoChevronBackCircle />
              <p>Back to Chats</p>
            </button>
            <div className="hr2 top" />
            <div className="list">
              {Array.isArray(users) && users.length > 0 ? (
                users.filter(filterUsers).map((user) => (
                  <div onClick={() => accessChat(user._id)} key={user._id}>
                    <User user={user} />
                  </div>
                ))
              ) : (
                <div className="nodata"></div>
              )}
            </div>
          </div>
        )}
        {!isSearching && (
          <div className="scrollable-feed-container">
            <ScrollableFeed className="scrollable-feed">
              <div>
                <div>
                  <button
                    className="create"
                    onClick={() => setModalVisible(true)}
                  >
                    <p>Create a Team</p>
                    <IoIosAddCircle />
                  </button>
                </div>
                <div className="hr2 top" />
                {Array.isArray(chats) && chats.length > 0 ? (
                  chats.map((chat) => (
                    <div key={chat._id} onClick={() => setSelectedChat(chat)}>
                      <ChatItem chat={chat} />
                    </div>
                  ))
                ) : (
                  <div></div>
                )}
              </div>
            </ScrollableFeed>
          </div>
        )}
      </div>
      {modalVisible && (
        <CreateTeamModal onClose={() => setModalVisible(false)} />
      )}
    </div>
  );
};

export default ChatList;
