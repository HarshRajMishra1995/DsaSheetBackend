const router = require("express").Router();
const { SignUp, Login, getUserProgress } = require("../controllers/Auth");

router.post("/signin", Login);
router.post("/signup", SignUp);
router.get("/:userId/progress", getUserProgress); // Fetch User Progress
module.exports = router;
