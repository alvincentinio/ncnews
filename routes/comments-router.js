const commentsRouter = require("express").Router();
const {
  patchCommentVotesById,
  deleteCommentById
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:commentId")
  .patch(patchCommentVotesById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
