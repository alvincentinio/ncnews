const { fetchAllTopics, createATopic } = require("../models/topics-model");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postATopic = (req, res, next) => {
  console.log(req.body);
  const { description, slug } = req.body;
  createATopic(description, slug)
    .then(topic => {
      res.status(201).send({ topic: topic[0] });
    })
    .catch(next);
};
