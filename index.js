const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();
require("dotenv").config();
const app = express();
const server = http.createServer(
  {
    maxHeaderSize: 160 * 1024 * 1024, // 16 MB
  },
  app
);
const mainRoutes = require("./routes/index");
const DbConnect = require("./config/db");
const { PORT, NODE_ENV } = process.env;
DbConnect();

const corsOptions = {
  credentials: true,
  origin: [
    // 😎LOCAL URL😎
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://192.168.1.134",
    "http://192.168.1.133",
  ],
  methods: ["GET", "POST"],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Register
router.post("/register", async (req, res) => {
  // hash password, save user, return token
});

// Login
router.post("/login", async (req, res) => {
  // Check password, return JWT token if valid
});

app.use(`/api/${process.env.API_VERSION}`, mainRoutes);

server.listen(PORT, (err) => {
  if (NODE_ENV == "DEVELOPMENT") {
    console.log(`Current Environment is ${NODE_ENV}💻`);
    console.log("Server is running on port " + PORT + "✅");
  } else {
    console.log(`Current Environment is ${NODE_ENV}💻`);
    console.log(`Server is listening at production.`);
  }
});

module.exports = router;
