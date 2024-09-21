const mongoose = require("mongoose");
const TopicSchema = new mongoose.Schema({
  name: String,
  level: String,
  chapters: [
    {
      name: String,
      subtopics: [
        {
          problem: String,
          tutorialLink: String,
          leetcodeLink: String,
          articleLink: String,
        },
      ],
    },
  ],
});
module.exports = mongoose.model("Topic", TopicSchema);
