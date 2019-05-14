const usersRouter = require("express").Router();
const {
  getUserById,
  postAUser,
  getAllUsers,
  deleteAUser
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
  .delete(deleteAUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
