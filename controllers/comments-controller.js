const {
  updateCommentVotesById,
  removeCommentById
} = require("../models/comments-model");

exports.patchCommentVotesById = (req, res, next) => {
  const { commentId } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotesById(commentId, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      console.log(err);
    });
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
