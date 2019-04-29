const { fetchAllTopics, createATopic } = require("../models/topics-model");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postATopic = (req, res, next) => {
  const { description, slug } = req.body;
  const requestLength = Object.keys(req.body).length;
  createATopic(description, slug)
    .then(topic => {
      if (
        description === undefined ||
        slug === undefined ||
        requestLength !== 2
      ) {
        return Promise.reject({ status: 400, msg: "Invalid Input" });
      } else {
        res.status(201).send({ topic: topic[0] });
      }
    })
    .catch(next);
};
