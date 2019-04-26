const topicsRouter = require("express").Router();
const {
  getAllTopics,
  postATopic
} = require("../controllers/topics-controller");
const { methodNotAllowed } = require("../errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .post(postATopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
