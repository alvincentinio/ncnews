const {
  updateCommentVotesById,
  removeCommentById
} = require("../models/comments-model");

exports.patchCommentVotesById = (req, res, next) => {
  const { commentId } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotesById(commentId, inc_votes)
    .then(comment => {
      let votesAsNumber = parseInt(inc_votes);
      if (
        inc_votes &&
        comment.length !== 0 &&
        typeof votesAsNumber === "number"
      ) {
        res.status(200).send({ comment });
      } else if (comment.length === 0 && typeof votesAsNumber == "number") {
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      } else if (!inc_votes) {
        return Promise.reject({
          status: 400,
          msg: "inc_votes not in request body"
        });
      }
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
