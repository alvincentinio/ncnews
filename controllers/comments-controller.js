const {
  updateCommentVotesById,
  removeCommentById,
  checkCommentExists
} = require("../models/comments-model");

exports.patchCommentVotesById = (req, res, next) => {
  const { commentId } = req.params;
  const { inc_votes } = req.body;
  const requestLength = Object.keys(req.body).length;
  const checkCommentExistsPromise = checkCommentExists(commentId);
  const updateCommentVotesByIdPromise = updateCommentVotesById(
    commentId,
    inc_votes
  );
  Promise.all([checkCommentExistsPromise, updateCommentVotesByIdPromise])
    .then(([result, comment]) => {
      if (result && result.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Id Not Found" });
      } else if ((inc_votes && requestLength === 1) || requestLength === 0) {
        res.status(200).send({ comment: comment[0] });
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
