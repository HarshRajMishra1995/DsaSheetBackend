const TopicModel = require("../models/topics");
const UserModel = require("../models/users");

// List all topics
const listTopics = async (req, res) => {
  try {
    const topics = await TopicModel.find(); // Retrieve all topics with chapters and subtopics
    res.status(200).json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve topics" });
  }
};

// Create a new topic with chapters and subtopics
const createTopic = async (req, res) => {
  try {
    const { name, level, chapters } = req.body;

    // Validate input
    if (!name || !level || !chapters || !Array.isArray(chapters)) {
      return res
        .status(400)
        .json({ message: "Name, level, and chapters are required" });
    }

    const newTopic = new TopicModel({
      name,
      level,
      chapters,
    });

    // Save the new topic
    await newTopic.save();
    res
      .status(201)
      .json({ message: "Topic created successfully", topic: newTopic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create topic" });
  }
};

// Edit an existing topic by ID, including its chapters and subtopics
const editTopic = async (req, res) => {
  try {
    const { id } = req.params; // Get topic ID from URL
    const { name, level, chapters } = req.body;

    // Find the topic by ID and update its fields
    const updatedTopic = await TopicModel.findByIdAndUpdate(
      id,
      { name, level, chapters },
      { new: true } // Return the updated topic
    );

    if (!updatedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res
      .status(200)
      .json({ message: "Topic updated successfully", topic: updatedTopic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update topic" });
  }
};

// Delete a topic by ID
const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params; // Get topic ID from URL

    const deletedTopic = await TopicModel.findByIdAndDelete(id);

    if (!deletedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete topic" });
  }
};

// Get a single topic by ID, including its chapters and subtopics
const getSingleTopic = async (req, res) => {
  try {
    const { id } = req.params; // Get topic ID from URL

    const topic = await TopicModel.findById(id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json(topic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve topic" });
  }
};

const saveUserProgress = async (req, res) => {
  const { userId, topicId, subtopicId, completed } = req.body;
  // Validate the required fields
  if (!userId || !topicId || typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "userId, topicId, and completed status are required" });
  }

  try {
    // Find the user by their ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if progress for the given topicId already exists
    const existingProgress = user.progress.find(
      (prog) => prog.topicId === topicId
    );

    if (existingProgress) {
      // If the progress for the topicId exists, update the completed status
      existingProgress.completed = completed;
    } else {
      // If the progress for the topicId doesn't exist, push a new entry
      user.progress.push({ topicId, completed });
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Progress updated successfully",
      progress: user.progress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update progress" });
  }
};

module.exports = {
  listTopics,
  createTopic,
  editTopic,
  deleteTopic,
  getSingleTopic,
  saveUserProgress,
};
