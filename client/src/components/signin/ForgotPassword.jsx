import React, { useState } from "react";
import "../signup/Signup.css";
import { MdAttachEmail } from "react-icons/md";
import { API } from "../../service/api";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const onInputChange = (e) => {
    setEmail({ ...email, [e.target.name]: e.target.value });
  };

  const forgotPass = async (e) => {
    e.preventDefault();

    let response = await API.forgotPassword(email);
    if (response.isSuccess) {
      setMessage(
        "A link to reset your password has been sent to your Email. The link will expire in 5 minutes."
      );
      setEmail("");
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
            Forgot Your Password? Please enter the email address associated with
            your account below.
          </p>
          <form className="columns">
            <div className="input-container">
              <MdAttachEmail />
              <input
                placeholder="Enter your Email"
                type="email"
                name="email"
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button className="fillbtn" onClick={(e) => forgotPass(e)}>
              Send Recovery Mail
            </button>
            <div className="erorr-container">
              {message && <p className="error">{message}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
