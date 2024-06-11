import React, { useState } from "react";
import "../signup/Signup.css";
import { FaPen } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { API } from "../../service/api";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const signinInitialValues = {
  username: "",
  password: "",
};

const Signin = ({ setIsAuthenticated, onSignin }) => {
  const [signin, setSignin] = useState(signinInitialValues);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const onInputChange = (e) => {
    setSignin({ ...signin, [e.target.name]: e.target.value });
  };

  const signinUser = async (e) => {
    e.preventDefault();

    console.log("Request reached the signup route.");

    let response = await API.userSignin(signin);
    if (response.isSuccess) {
      onSignin(response.data.user);
      console.log(response.data.user);
      setIsAuthenticated(true);
      setSignin(signinInitialValues);
      navigate("/");
    } else {
      console.log("error");
    }
  };

  return (
    <div className="signup-container">
      <div>
        <div className="box">
          <div className="btns">
            <Link to="/signup">
              <h3 className="inactive">Sign Up</h3>
            </Link>
            <Link to="/signin">
              <h3 className="active">Sign In</h3>
            </Link>
          </div>
          <p>
            Sign in to access your workspace, collaborate with your team, and
            manage your projects efficiently.
          </p>
          <form className="columns">
            <div className="input-container">
              <FaPen />
              <input
                placeholder="Enter your Username"
                type="text"
                name="username"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="input-container">
              <RiLockPasswordFill />
              <input
                placeholder="Enter your Password"
                type="password"
                name="password"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button className="fillbtn" onClick={(e) => signinUser(e)}>
              Sign in
            </button>
            <p className="forgot">
              Forgot Password?{" "}
              <Link to="/forgotPassword">
                <span>Click here.</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
