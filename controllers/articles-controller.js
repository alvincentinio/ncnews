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
      else return Promise.reject({ status: 404, msg: "Id Not Found" });
    })
    .catch(next);
};

exports.patchArticleVotesById = (req, res, next) => {
  const { articleId } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotesById(articleId, inc_votes)
    .then(article => {
      let votesAsNumber = parseInt(inc_votes);
      if (
        inc_votes &&
        article.length !== 0 &&
        typeof votesAsNumber == "number"
      ) {
        res.status(200).send({ article });
      } else if (article.length === 0 && typeof votesAsNumber == "number") {
        return Promise.reject({ status: 404, msg: "Article Id Not Found" });
      } else if (!inc_votes) {
        return Promise.reject({
          status: 400,
          msg: "inc_votes not in request body"
        });
      }
    })

    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { sort_by, order } = req.query;
  fetchCommentsByArticleId(articleId, sort_by, order)
    .then(comments => {
      if (comments.length !== 0) res.status(200).send(comments);
      else return Promise.reject({ status: 404, msg: "Id Not Found" });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { username, body } = req.body;
  createCommentByArticleId(articleId, username, body)
    .then(comment => {
      if (username && body && Object.keys(req.body).length === 2) {
        res.status(201).send({ comment });
        // if !username => return bad request "username required in request"
        // if !body => return "body required in request"
        // if username not a string, body not a string => bad request
        //
      } else {
        return Promise.reject({ status: 400, msg: "Invalid Input" });
      }
    })
    .catch(next);
};
