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

const Navbar = ({ setIsAuthenticated }) => {
  const { user } = useUser();

  const navigate = useNavigate();
  const logoutUser = async () => {
    localStorage.removeItem("user");
    const response = await API.userLogout();
    if (response.isSuccess) {
      navigate("/signin");
      setIsAuthenticated(false);
    }
  };

  return (
    <>
      <div className="navbar-container">
        <div className="left">
          <div className="input-container">
            <MdOutlinePersonSearch className="user-search-icon" />
            <input placeholder="Search user..." />
          </div>
        </div>
        <div className="right">
          <Link to="/">
            <FaHome className="home-icon" />
          </Link>
          <IoIosNotifications className="notification-icon" />
          <Link to={`/profile/${user?._id}`}>
            <FaUserCircle className="user-icon" />
          </Link>
          <button className="logout-btn" onClick={() => logoutUser()}>
            <p>Log Out</p>
            <IoMdLogOut className="logout-icon" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
