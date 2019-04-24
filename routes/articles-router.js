const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  patchArticleVotesById,
  getCommentsByArticleId,
  postCommentByArticleId
} = require("../controllers/articles-controller");
const { methodNotAllowed } = require("../errors");
const { routeNotFound } = require("../errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:articleId")
  .get(getArticleById)
  .patch(patchArticleVotesById)
  .all(methodNotAllowed);

articlesRouter
  .route("/:articleId/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotAllowed);

module.exports = articlesRouter;
