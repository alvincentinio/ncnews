const usersRouter = require("express").Router();
const {
  getUserById,
  postAUser,
  getAllUsers
} = require("../controllers/users-controller");
const { methodNotAllowed } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(methodNotAllowed);

usersRouter
  .route("/")
  .get(getAllUsers)
  .post(postAUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
