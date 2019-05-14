const topicsRouter = require("express").Router();
const {
  getAllTopics,
  postATopic,
  deleteATopic
} = require("../controllers/topics-controller");
const { methodNotAllowed } = require("../errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .post(postATopic)
  .delete(deleteATopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
