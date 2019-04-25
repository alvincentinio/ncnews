const {
  updateCommentVotesById,
  removeCommentById
} = require("../models/comments-model");

exports.patchCommentVotesById = (req, res, next) => {
  const { commentId } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotesById(commentId, inc_votes)
    .then(comment => {
      console.log(typeof inc_votes);
      if (comment.length !== 0 && typeof inc_votes == "number")
        res.status(200).send({ comment });
      else if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      } else return Promise.reject({});
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { commentId } = req.params;
  removeCommentById(commentId)
    .then(result => {
      if (result === 1) {
        res.status(204).send();
      } else {
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      }
    })
    .catch(next);
};
