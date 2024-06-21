import React, { useState } from "react";
import "../signup/Signup.css";
import { FaPen } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdAttachEmail } from "react-icons/md";
import { API } from "../../service/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const passwordInitialValues = {
  password: "",
  confirmPassword: "",
  token: "",
};

const ResetPassword = () => {
  const [password, setPassword] = useState(passwordInitialValues);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { token } = useParams();
  password.token = token;

  const onInputChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const resetPass = async (e) => {
    e.preventDefault();
    const newPassword = password.password;
    const confirmPassword = password.confirmPassword;

    if (newPassword !== confirmPassword) {
      setError(
        "Passwords do not match. Please retype your new password and try again."
      );
      return;
    }

    let response = await API.resetPassword(password);
    if (response.isSuccess) {
      alert("Password updated successfully.");
      setPassword(passwordInitialValues);
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
            <Link to="/signup">
              <h3 className="inactive">Sign Up</h3>
            </Link>
            <Link to="/signin">
              <h3 className="active">Sign In</h3>
            </Link>
          </div>
          <p>
            Once you've entered your new password, click the "Reset Password"
            button to confirm the changes.
          </p>
          <form className="columns">
            <div className="input-container">
              <RiLockPasswordLine />
              <input
                placeholder="Enter your new Password"
                type="password"
                name="password"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="input-container">
              <RiLockPasswordFill />
              <input
                placeholder="Retype your new Password"
                type="password"
                name="confirmPassword"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button className="fillbtn" onClick={(e) => resetPass(e)}>
              Reset Password
            </button>
            <div className="error-container">
              {error && <p className="error">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
