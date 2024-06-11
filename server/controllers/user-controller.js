import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const url =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const signupUser = async (request, response) => {
  const existingUserByEmail = await User.findOne({ email: request.body.email });
  if (existingUserByEmail) {
    return response.status(400).json({ msg: "This email is already in use." });
  }
  const existingUserByUsername = await User.findOne({
    username: request.body.username,
  });
  if (existingUserByUsername) {
    return response
      .status(400)
      .json({ msg: "This username is already in use." });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(request.body.password, salt);
    const user = {
      username: request.body.username,
      name: request.body.name,
      email: request.body.email,
      profession: request.body.profession,
      password: hashedPassword,
    };

    const newUser = new User(user);
    await newUser.save();

    return response.status(200).json({ msg: "Signup successful." });
  } catch (error) {
    return response.status(500).json({ msg: "Error during Sign up." });
  }
};

export const signinUser = async (request, response) => {
  try {
    const { username, password } = request.body;
    const user = await User.findOne({ username });
    if (!user) {
      return response.status(400).json({ message: "User is not registered." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return response.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ username: user.username }, process.env.KEY, {
      expiresIn: "6h",
    });
    response.cookie("token", token, { httpOnly: true, maxAge: 360000 });

    return response
      .status(200)
      .json({ status: true, message: "Login successful.", user });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return response.status(500).json({ message: "Error during Sign in." });
  }
};

export const forgotPassword = async (request, response) => {
  try {
    const { email } = request.body;
    console.log(request.body);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return response.status(400).json({ message: "User not registered." });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    var mailOptions = {
      from: "sarojabamra@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `We received a request to reset the password for your account associated with this email address. Please click the link below to reset your password:
${url}/resetPassword/${token}
If you did not request a password reset, please ignore this email.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ message: "An error occured while sending the Email." });
      } else {
        console.log("Email sent: " + info.response);
        return response
          .status(200)
          .json({ status: true, message: "The Email has been sent." });
      }
    });
    return response
      .status(200)
      .json({ message: "An email has been sent successfully." });
  } catch (error) {
    return response.status(500).json({ message: "Error sending mail." });
  }
};

export const resetPassword = async (request, response) => {
  const { token } = request.body;
  const { password } = request.body;
  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
    return response
      .status(200)
      .json({ status: true, message: "Password updated succesfully." });
  } catch (error) {
    return response.status(500).json({ message: "Invalid Token." });
  }
};

export const verifyAuthentication = async (request, response) => {
  return response
    .status(200)
    .json({ status: true, message: "Is Authenticated." });
};

export const verifyUser = async (request, response, next) => {
  try {
    const token = request.cookies.token;
    console.log(token);
    if (!token) {
      return response.status(400).json({ status: false, message: "No token." });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    next();
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const userLogout = async (request, response) => {
  response.clearCookie("token");
  return response
    .status(200)
    .json({ status: true, message: "Logged out successfully." });
};

export const getUserById = async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    return response.status(200).json(user);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "An error occurred while getting the user." });
  }
};

export const updateProfileById = async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    if (!user) {
      return response.status(400).json({ msg: "User not found." });
    }
    await User.findByIdAndUpdate(request.params.id, { $set: request.body });

    return response
      .status(200)
      .json({ msg: "User Profile updated Successfully." });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};
