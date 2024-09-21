const router = require("express").Router();
const { SignUp, Login } = require("../controllers/Auth");

router.post("/signin", Login);
router.post("/signup", SignUp);
module.exports = router;
