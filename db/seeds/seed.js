const {
  articlesData,
  commentsData,
  topicsData,
  usersData
} = require("../data");
const {
  formatDate,
  renameCommentKeys,
  formatComment
} = require("../../utils/formatData");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics")
        .insert(topicsData)
        .returning("*");
    })
    .then(topic => {
      return knex("users")
        .insert(usersData)
        .returning("*");
    })
    .then(user => {
      const formattedArticles = formatDate(articlesData);
      return knex("articles")
        .insert(formattedArticles)
        .returning("*");
    })
    .then(article => {
      const formattedCommentDate = formatDate(commentsData);
      const formattedCommentKeys = renameCommentKeys(formattedCommentDate);
      const formattedComments = formatComment(article, formattedCommentKeys);
      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
