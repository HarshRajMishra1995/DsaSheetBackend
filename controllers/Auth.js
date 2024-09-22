const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/users");

const SignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send the response with the token
    res.status(201).json({ token, user: { id: newUser._id, username, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user exists
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send the response with the token and user info
    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  SignUp,
  Login,
};
