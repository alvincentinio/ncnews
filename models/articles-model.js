const connection = require("../db/connection");

exports.fetchAllArticles = ({ author, topic, sort_by, order, limit, p }) => {
  return connection
    .select(
      "articles.article_id",
      "articles.author",
      "title",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.article_id AS comment_count")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (author) query.where("articles.author", "=", author);
      if (topic) query.where("topic", "=", topic);
    })
    .limit(limit || 10)
    .offset(limit * (p - 1) || 10 * (p - 1) || 0);
};
exports.fetchArticleCount = (author, topic) => {
  return connection
    .select("*")
    .from("articles")
    .modify(query => {
      if (author) query.where("articles.author", "=", author);
      if (topic) query.where("topic", "=", topic);
    })
    .then(articles => articles.length);
};

exports.fetchArticleById = articleId => {
  return connection
    .select(
      "articles.article_id",
      "articles.author",
      "title",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.article_id AS comment_count")
    .from("articles")
    .where("articles.article_id", "=", articleId)
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .returning("*");
};

exports.updateArticleVotesById = (articleId, inc_votes) => {
  return connection("articles")
    .where("article_id", "=", articleId)
    .increment("votes", inc_votes || 0)
    .returning("*");
};

exports.fetchCommentsByArticleId = (articleId, sort_by, order, limit, p) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("comments.article_id", "=", articleId)
    .orderBy(sort_by || "created_at", order || "desc")
    .returning("*")
    .limit(limit || 10)
    .offset(limit * (p - 1) || 10 * (p - 1) || 0);
};

exports.createCommentByArticleId = (articleId, username, body) => {
  const commentToInsert = {
    article_id: articleId,
    body: body,
    author: username
  };
  return connection("comments")
    .insert(commentToInsert)
    .returning("*");
};

exports.createAnArticle = (username, title, body, topic) => {
  const articleToInsert = {
    author: username,
    title: title,
    body: body,
    topic: topic
  };
  return connection("articles")
    .insert(articleToInsert)
    .returning("*");
};

exports.removeArticleById = articleId => {
  return connection("articles")
    .where("article_id", "=", articleId)
    .del();
};

exports.checkAuthorExists = author => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", author)
    .returning("*");
};

exports.checkTopicExists = topic => {
  return connection
    .select("*")
    .from("topics")
    .where("slug", "=", topic)
    .returning("*");
};

exports.checkArticleExists = articleId => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", articleId)
    .returning("*");
};
