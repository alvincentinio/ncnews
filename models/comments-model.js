const connection = require("../db/connection");

exports.updateCommentVotesById = (commentId, inc_votes) => {
  return connection("comments")
    .where("comment_id", "=", commentId)
    .increment("votes", inc_votes || 0)
    .returning("*");
};

exports.removeCommentById = commentId => {
  return connection("comments")
    .where("comment_id", "=", commentId)
    .del();
};

exports.checkCommentExists = commentId => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", commentId)
    .returning("*");
};
