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
      res.status(200).send(articles);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  fetchArticleById(articleId)
    .then(article => {
      res.status(200).send(article[0]);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.patchArticleVotesById = (req, res, next) => {
  const { articleId } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotesById(articleId, inc_votes)
    .then(([article]) => {
      res.status(200).send(article);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { sort_by, order } = req.query;
  fetchCommentsByArticleId(articleId, sort_by, order)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { username, body } = req.body;
  // console.log(articleId);
  // console.log(username);
  // console.log(body);
  // console.log(req.body);
  createCommentByArticleId(articleId, username, body)
    .then(result => {
      // console.log(result);
      res.status(201).send(result);
    })
    .catch(err => {
      console.log(err);
    });
};
