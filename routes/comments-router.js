const commentsRouter = require("express").Router();
const {
  patchCommentVotesById,
  deleteCommentById
} = require("../controllers/comments-controller");
const { methodNotAllowed } = require("../errors");

commentsRouter
  .route("/:commentId")
  .patch(patchCommentVotesById)
  .delete(deleteCommentById)
  .all(methodNotAllowed);

module.exports = commentsRouter;
