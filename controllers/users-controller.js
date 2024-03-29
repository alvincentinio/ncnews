const {
  fetchUserById,
  createAUser,
  fetchAllUsers,
  removeUserByUsername
} = require("../models/users-model");

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUserById(username)
    .then(user => {
      if (user.length !== 0) {
        res.status(200).send({ user: user[0] });
      } else if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }
    })
    .catch(next);
};

exports.postAUser = (req, res, next) => {
  const { username, avatar_url, name } = req.body;
  createAUser(username, avatar_url, name)
    .then(user => {
      res.status(201).send({ user: user[0] });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.deleteAUser = (req, res, next) => {
  const { username } = req.body;
  removeUserByUsername(username)
    .then(result => {
      if (result === 1) {
        res.status(204).send();
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    })
    .catch(next);
};
