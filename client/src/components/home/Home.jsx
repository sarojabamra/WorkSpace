import React, { useEffect, useState } from "react";
import { API } from "../../service/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

import ChatList from "../chatlist/ChatList";
import { ChatState } from "../../context/ChatProvider";
import ChatPage from "../chatpage/ChatPage";

const Home = ({ isSearching, isUserSearching }) => {
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await API.verifyAuthentication();
        if (!response.isSuccess) {
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
        navigate("/signin");
      }
    };

    verifyAuth();
  }, []);

  return (
    <div className="home-container">
      <div className="home-navbar"></div>
      <div className="home-page">
        <ChatList
          fetchAgain={fetchAgain}
          isSearching={isSearching}
          isUserSearching={isUserSearching}
        />
        <div className="chat-area">
          <ChatPage fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </div>
    </div>
  );
};

export default Home;
