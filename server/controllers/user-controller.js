import bcrypt from "bcrypt";
import User from "../models/user.js";

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
    return response.status(500).json({ msg: "Error during signup." });
  }
};

export const signinUser = async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
};
