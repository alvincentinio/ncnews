const {
  fetchAllArticles,
  fetchArticleById
} = require("../models/articles-model");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
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
