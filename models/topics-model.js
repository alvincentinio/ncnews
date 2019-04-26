const connection = require("../db/connection");

exports.fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

exports.createATopic = (description, slug) => {
  const topicToInsert = {
    description: description,
    slug: slug
  };
  console.log(topicToInsert);
  return connection("topics")
    .insert(topicToInsert)
    .returning("*");
};
