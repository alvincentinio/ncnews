const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  patchArticleVotesById,
  getCommentsByArticleId,
  postCommentByArticleId
} = require("../controllers/articles-controller");

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:articleId")
  .get(getArticleById)
  .patch(patchArticleVotesById);

articlesRouter
  .route("/:articleId/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
