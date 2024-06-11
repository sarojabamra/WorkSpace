import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../service/api";
import "./Profile.css";
import { FaUserCircle } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  //getUserbyID
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return; // Skip fetching if id is undefined
        let response = await API.getUserById(id);
        if (response.isSuccess) {
          setUser(response.data);
        } else {
          console.log("Request failed:", response);
        }
      } catch (error) {
        console.log("There is an Error here:", error);
      }
    };
    fetchData();
  }, [id]);

  const updateProfile = async () => {
    let response = await API.updateProfile(user);

    if (response.isSuccess) {
      navigate(`/profile/${id}`);
    }
  };

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const url = user.image ? user.image : "../../../images/profile-photo.jpg";

  return (
    <>
      <div className="profile-container">
        <div className="box">
          <div className="btns">
            <Link to={`/profile/${user._id}`}>
              <button className="inactive">View profile</button>
            </Link>
            <Link to={`/profile/edit/${user._id}`}>
              <button className="active">Edit profile</button>
            </Link>
          </div>
          <div className="profile-content">
            <div className="imgdiv">
              <img src={url} alt="Profile Photo" />
            </div>
            <div className="input-container">
              <FaUserCircle />
              <input
                placeholder=""
                value={user.name}
                name="name"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="input-container">
              <FaPen />
              <input
                placeholder=""
                value={user.username}
                name="username"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="input-container">
              <MdAttachEmail />
              <input
                placeholder=""
                value={user.email}
                name="email"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="input-container">
              <FaUserTie />
              <p className="profession">
                Profession:
                <input
                  placeholder=""
                  value={user.profession}
                  name="profession"
                  onChange={(e) => handleChange(e)}
                />
              </p>
            </div>
            <button className="profile-picture" onClick={() => updateProfile()}>
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
