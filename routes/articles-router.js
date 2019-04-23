const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById
} = require("../controllers/articles-controller");

articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:articleId").get(getArticleById);

module.exports = articlesRouter;
