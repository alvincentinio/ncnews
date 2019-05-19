const {
  fetchAllArticles,
  fetchArticleById,
  updateArticleVotesById,
  fetchCommentsByArticleId,
  createCommentByArticleId,
  createAnArticle,
  removeArticleById,
  checkAuthorExists,
  checkTopicExists,
  checkArticleExists,
  fetchArticleCount
} = require("../models/articles-model");

exports.getAllArticles = (req, res, next) => {
  const { author, topic } = req.query;
  let checkExistsPromise;
  if (author) checkExistsPromise = checkAuthorExists(author);
  else if (topic) checkExistsPromise = checkTopicExists(topic);
  const fetchAllArticlesPromise = fetchAllArticles(req.query);
  Promise.all([
    checkExistsPromise,
    fetchAllArticlesPromise,
    fetchArticleCount(author, topic)
  ])
    .then(([result, articles, total_count]) => {
      if (result && result.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Query Does Not Exist In Database"
        });
      } else {
        res.status(200).send({ total_count, articles });
      }
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  fetchArticleById(articleId)
    .then(article => {
      if (article.length !== 0) res.status(200).send({ article: article[0] });
      else return Promise.reject({ status: 404, msg: "Id Not Found" });
    })
    .catch(next);
};

exports.patchArticleVotesById = (req, res, next) => {
  const { articleId } = req.params;
  const { inc_votes } = req.body;
  const requestLength = Object.keys(req.body).length;
  const checkArticleExistsPromise = checkArticleExists(articleId);
  const updateArticleVotesByIdPromise = updateArticleVotesById(
    articleId,
    inc_votes
  );
  Promise.all([checkArticleExistsPromise, updateArticleVotesByIdPromise])
    .then(([result, article]) => {
      if (result && result.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Id Not Found" });
      } else if ((inc_votes && requestLength === 1) || requestLength === 0) {
        res.status(200).send({ article: article[0] });
      } else if (!inc_votes) {
        return Promise.reject({
          status: 400,
          msg: "inc_votes not in request body"
        });
      } else if (requestLength > 1) {
        return Promise.reject({
          status: 400,
          msg: "invalid request body"
        });
      }
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { sort_by, order } = req.query;
  const checkArticleExistsPromise = checkArticleExists(articleId);
  const fetchCommentsByArticleIdPromise = fetchCommentsByArticleId(
    articleId,
    sort_by,
    order
  );
  Promise.all([checkArticleExistsPromise, fetchCommentsByArticleIdPromise])
    .then(([result, comments]) => {
      if (result && result.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Id Not Found" });
      } else {
        res.status(200).send({ comments });
      }
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { username, body } = req.body;
  const requestLength = Object.keys(req.body).length;
  checkArticleExists(articleId)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid Article Id" });
      } else if (
        username === undefined ||
        body === undefined ||
        requestLength !== 2
      ) {
        return Promise.reject({ status: 400, msg: "Invalid Input" });
      } else {
        createCommentByArticleId(articleId, username, body)
          .then(comment => {
            res.status(201).send({ comment: comment[0] });
          })
          .catch(next);
      }
    })
    .catch(next);
};

exports.postAnArticle = (req, res, next) => {
  const requestLength = Object.keys(req.body).length;
  const { username, title, body, topic } = req.body;
  createAnArticle(username, title, body, topic)
    .then(article => {
      if (
        username === undefined ||
        title === undefined ||
        body === undefined ||
        topic === undefined ||
        requestLength !== 4
      ) {
        return Promise.reject({ status: 400, msg: "Invalid Input" });
      } else {
        res.status(201).send({ article: article[0] });
      }
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { articleId } = req.params;
  removeArticleById(articleId)
    .then(result => {
      if (result === 1) {
        res.status(204).send();
      } else {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
    })
    .catch(next);
};
