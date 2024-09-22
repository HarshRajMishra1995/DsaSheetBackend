const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/users");
const TopicModel = require("../models/topics");

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

const getUserProgress = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await UserModel.findById(userId).populate("progress.topicId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const populatedProgress = await Promise.all(
      user.progress.map(async (progressItem) => {
        // Find the topic that contains the subtopicId
        const topic = await TopicModel.findOne({
          "chapters.subtopics._id": progressItem.topicId,
        });

        if (topic) {
          // Find the specific chapter and subtopic within the topic
          const chapter = topic.chapters.find((chap) =>
            chap.subtopics.some(
              (sub) => sub._id.toString() === progressItem.topicId
            )
          );

          const subtopic = chapter.subtopics.find(
            (sub) => sub._id.toString() === progressItem.topicId
          );

          // Return the topic, chapter, and subtopic details along with progress
          return {
            topicId: topic._id,
            topicName: topic.name, // Topic name
            chapterName: chapter.name, // Chapter name
            subtopicProblem: subtopic.problem, // Subtopic problem name
            tutorialLink: subtopic.tutorialLink,
            leetcodeLink: subtopic.leetcodeLink,
            articleLink: subtopic.articleLink,
            completed: progressItem.completed,
          };
        } else {
          return null;
        }
      })
    );
    let seenTopics = new Set();

    let progressDetailsForProfile = populatedProgress
      .filter((item) => {
        // Check if the topicId has already been added
        if (!seenTopics.has(item.topicId.toString())) {
          seenTopics.add(item.topicId.toString()); // Mark as seen
          return true; // Keep this item
        }
        return false; // Filter out duplicates
      })
      .map((item) => ({
        topicId: item.topicId,
        topicName: item.topicName,
        completed: item.completed,
      }));
    return res.status(200).json({
      progress: user.progress,
      topicCompletedDetails: progressDetailsForProfile,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve user progress" });
  }
};

module.exports = {
  SignUp,
  Login,
  getUserProgress,
};
