const connection = require("../db/connection");

// NEEDS TO NOT DISPLAY BODY & ADD COUNT
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

// NEED TO ADD COUNT
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
