const getEndPoints = () => {
  const endPointObj = {
    "/api": "GET - list of all available endpoints",
    "/api/topics":
      "GET - array of topic objects, POST - a new topic {slug: 'xxx-unique topic', description: 'xxx'}",
    "/api/articles":
      "GET - array of article objects, POST - a new article {username: 'existing username',title: 'xxx',body: 'xxx', topic: 'existing topic'}",
    "/api/articles/:article_id":
      "GET - article by article_id, PATCH - update article votes by article_id { inc_votes: ** number of votes to increment **}, DELETE - article by article_id",
    "/api/articles/:article_id/comments":
      "GET - all comments belonging to article_id, POST - new comment by article_id {username: 'xxx', body: 'xxx'}",
    "/api/comments/:comment_id":
      "PATCH - update comment votes by comment_id { inc_votes: ** number of votes to increment **}, DELETE - comment by comment_id",
    "/api/users":
      "GET - array of user objects, POST - new user {username: 'xxx- unique username',avatar_url: 'valid url', name: 'xxx'}",
    "api/users/:username": "GET - user by username"
  };
  return endPointObj;
};

module.exports = { getEndPoints };
