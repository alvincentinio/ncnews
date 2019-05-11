const apiRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { getEndPoints } = require("../getEndPoints");
const topicsRouter = require("../routes/topics-router");
const articlesRouter = require("../routes/articles-router");
const commentsRouter = require("../routes/comments-router");
const usersRouter = require("../routes/users-router");

apiRouter
  .route("/")
  .get((req, res) => res.status(200).send({ endpoints: getEndPoints() }))
  .all(methodNotAllowed);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
