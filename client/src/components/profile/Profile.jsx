import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../service/api";
import "./Profile.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaIdCard } from "react-icons/fa6";

const Profile = () => {
  const [user, setUser] = useState({});
  const [file, setFile] = useState("");
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

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
          const response = await API.uploadFile(data);
          if (response.isSuccess) {
            setUser((prevUser) => ({ ...prevUser, image: response.data }));
          } else {
            console.log("Upload failed:", response.message);
          }
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      }
    };
    getImage();
  }, [file]);

  useEffect(() => {
    const updateProfile = async () => {
      try {
        let response = await API.updateProfile(user);
        if (response.isSuccess) {
          navigate(`/profile/${id}`);
        } else {
          console.log("Update failed:", response.message);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

    if (Object.keys(user).length !== 0) {
      updateProfile();
    }
  }, [user]);

  const url = user.image ? user.image : "../../../images/profile-photo.jpg";

  return (
    <>
      <div className="profile-container">
        <div className="box">
          <div className="btns">
            <Link to={`/profile/${user?._id}`}>
              <button className="active">View profile</button>
            </Link>
            <Link to={`/profile/edit/${user._id}`}>
              <button className="inactive">Edit profile</button>
            </Link>
          </div>
          <div className="profile-content">
            <div className="imgdiv">
              <img src={url} alt="Profile Photo" />
            </div>
            <div className="input-container">
              <FaIdCard />
              <p>{user._id}</p>
            </div>
            <div className="input-container">
              <FaUserCircle />
              <p>{user.name}</p>
            </div>
            <div className="input-container">
              <FaPen />
              <p>{user.username}</p>
            </div>
            <div className="input-container">
              <MdAttachEmail />
              <p>{user.email}</p>
            </div>
            <div className="input-container">
              <FaUserTie />
              <p>Profession: {user.profession}</p>
            </div>
            <input
              type="file"
              className="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="fileInput" className="profile-picture">
              Change Profile Picture?
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
