const {
  fetchAllArticles,
  fetchArticleById,
  updateArticleVotesById,
  fetchCommentsByArticleId,
  createCommentByArticleId
} = require("../models/articles-model");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      if (articles.length !== 0) res.status(200).send({ articles });
      else
        return Promise.reject({
          status: 200,
          msg: "no articles in database for selected author"
        });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  fetchArticleById(articleId)
    .then(article => {
      if (article.length !== 0) res.status(200).send(article[0]);
      else return Promise.reject({ status: 404, msg: "article_id not found" });
    })
    .catch(next);
};

exports.patchArticleVotesById = (req, res, next) => {
  const { articleId } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotesById(articleId, inc_votes)
    .then(([article]) => {
      if (article) res.status(200).send(article);
      else return Promise.reject({ status: 404, msg: "article_id not found" });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { sort_by, order } = req.query;
  fetchCommentsByArticleId(articleId, sort_by, order)
    .then(comments => {
      if (comments.length !== 0) res.status(200).send(comments);
      else return Promise.reject({ status: 404, msg: "article_id not found" });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { username, body } = req.body;
  createCommentByArticleId(articleId, username, body)
    .then(result => {
      res.status(201).send(result);
    })
    .catch(next);
};
