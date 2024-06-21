import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlinePersonSearch } from "react-icons/md";
import { API } from "../../service/api";
import { useUser } from "../../context/UserContext";
import { FaHome } from "react-icons/fa";
import "./Navbar.css";
import { IoNotifications } from "react-icons/io5";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import NotificationModal from "./notifications/NotificationModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const Navbar = ({ setIsAuthenticated, isUserSearching }) => {
  const [activeIcon, setActiveIcon] = useState("home");
  const { user } = useUser();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const { setSearchQuery, searchQuery, notification, setNotification } =
    ChatState();

  const logoutUser = async () => {
    localStorage.removeItem("user");
    const response = await API.userLogout();
    if (response.isSuccess) {
      navigate("/signin");
      setIsAuthenticated(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearching = () => {
    isUserSearching(true);
    navigate("/");
    setActiveIcon("home");
  };

  const viewNotifications = () => {
    setActiveIcon("notification");
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setActiveIcon("home");
    navigate("/");
  };

  return (
    <>
      <div className="navbar-container">
        <div className="left">
          <div className="input-container">
            <MdOutlinePersonSearch className="user-search-icon" />
            <input
              placeholder="Search for a user..."
              onChange={handleSearch}
              onClick={() => handleSearching()}
            />
          </div>
        </div>
        <NotificationModal
          visible={modalVisible}
          onClose={handleClose}
          notification={notification}
          setNotification={setNotification}
        />
        <div className="right">
          <Link to="/">
            <FaHome
              className={`home-icon icon ${
                activeIcon === "home" ? "active-icon" : ""
              }`}
              onClick={() => setActiveIcon("home")}
            />
          </Link>
          <div>
            <NotificationBadge
              count={notification?.length}
              effect={Effect.SCALE}
            />
            <IoNotifications
              className={`notification-icon icon ${
                activeIcon === "notification" ? "active-icon" : ""
              }`}
              onClick={() => viewNotifications()}
            />
          </div>
          <Link to={`/profile/${user?._id}`}>
            <FaUserCircle
              className={`user-icon icon ${
                activeIcon === "user" ? "active-icon" : ""
              }`}
              onClick={() => setActiveIcon("user")}
            />
          </Link>
          <div className="vr" />
          <button className="logout-btn" onClick={() => logoutUser()}>
            <p>Log Out</p>
            <IoMdLogOut className="logout-icon" />
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(Navbar);
