const connection = require("../db/connection");

exports.fetchUserById = username => {
  return connection
    .select("*")
    .from("users")
    .where("users.username", "=", username)
    .returning("*");
};

exports.createAUser = (username, avatar_url, name) => {
  const userToInsert = {
    username: username,
    avatar_url: avatar_url,
    name: name
  };
  return connection("users")
    .insert(userToInsert)
    .returning("*");
};

exports.fetchAllUsers = () => {
  return connection.select("*").from("users");
};

exports.removeUserByUsername = username => {
  return connection("users")
    .where("username", "=", username)
    .del();
};
