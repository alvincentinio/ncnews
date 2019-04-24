const usersRouter = require("express").Router();
const { getUserById } = require("../controllers/users-controller");

usersRouter.route("/:username").get(getUserById);

module.exports = usersRouter;
