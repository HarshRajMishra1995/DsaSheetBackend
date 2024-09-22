const express = require("express");
const Router = express.Router();
const authRoute = require("./Auth");
const topicRoute = require("./Topics");

Router.use(`/Auth`, authRoute);
Router.use(`/Topic`, topicRoute);

module.exports = Router;
