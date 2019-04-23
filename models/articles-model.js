const connection = require("../db/connection");

exports.fetchAllArticles = ({ author, topic, sort_by, order }) => {
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
    });
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
    .increment("votes", inc_votes)
    .returning("*");
};

exports.fetchCommentsByArticleId = (articleId, sort_by, order) => {
  return connection
    .select("*")
    .from("comments")
    .where("comments.article_id", "=", articleId)
    .orderBy(sort_by || "created_at", order || "desc")
    .returning("*");
};

exports.createCommentByArticleId = (articleId, username, body) => {
  const commentToInsert = {
    article_id: articleId,
    body: body,
    author: username
  };
  console.log(commentToInsert);
  return connection("comments")
    .insert(commentToInsert)
    .returning("*");
};
