const router = require("express").Router();
const {
  listTopics,
  editTopic,
  saveUserProgress,
  createTopic,
  getSingleTopic,
  deleteTopic,
} = require("../controllers/Topics");

router.get("listtopics/", listTopics); // GET all topics
router.post("createtopics/", createTopic); // POST a new topic
router.put("edittopics/:id", editTopic); // PUT (edit) a topic by ID
router.delete("deletetopics/:id", deleteTopic); // DELETE a topic by ID
router.get("getsingletopics/:id", getSingleTopic); // GET a single topic by ID
router.post("/progress", saveUserProgress);
module.exports = router;
