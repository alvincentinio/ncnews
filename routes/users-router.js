const usersRouter = require("express").Router();
const { getUserById } = require("../controllers/users-controller");
const { methodNotAllowed } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(methodNotAllowed);

module.exports = usersRouter;
