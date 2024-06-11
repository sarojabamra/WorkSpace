import React, { useState } from "react";
import "./Signup.css";
import { FaUserCircle } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { API } from "../../service/api";
import { Link, useNavigate } from "react-router-dom";

const signupInitialValues = {
  username: "",
  name: "",
  password: "",
  profession: "",
  email: "",
};

const Signup = () => {
  const [signup, setSignup] = useState(signupInitialValues);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const signupUser = async (e) => {
    e.preventDefault();

    let response = await API.userSignup(signup);
    if (response.isSuccess) {
      alert("User registered.");
      navigate("/signin");
    } else {
      console.log("error");
    }
  };
  return (
    <div className="signup-container">
      <div>
        <div className="box">
          <div className="btns">
            <Link to="signup">
              <h3 className="active">Sign Up</h3>
            </Link>
            <Link to="/signin">
              <h3 className="inactive">Sign In</h3>
            </Link>
          </div>
          <p className="prompt">
            Create an account to join your team and start collaborating
            efficiently. Please enter your details below.
          </p>
          <form className="columns">
            <div className="input-container">
              <FaUserCircle />
              <input
                placeholder="Enter your Name"
                type="text"
                name="name"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="input-container">
              <MdAttachEmail />
              <input
                placeholder="Enter your Email"
                type="email"
                name="email"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="input-container">
              <FaUserTie />
              <input
                placeholder="Your Profession"
                type="text"
                name="profession"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="input-container">
              <FaPen />
              <input
                placeholder="Set a Username"
                type="text"
                name="username"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="input-container">
              <RiLockPasswordFill />
              <input
                placeholder="Set a Password"
                type="password"
                name="password"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button className="fillbtn" onClick={(e) => signupUser(e)}>
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
