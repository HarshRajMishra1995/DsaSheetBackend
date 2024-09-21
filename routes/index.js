const express = require("express");
const Router = express.Router();
const authRoute = require("./Auth");
const topicRoute = require("./Topics");

Router.use(`/api/${process.env.API_VERSION}`, authRoute);
Router.use(`/api/${process.env.API_VERSION}`, topicRoute);

module.exports = Router;
