const getEndPoints = () => {
  const endPointObj = {
    "/api": "GET - list of all available endpoints",
    "/api/topics":
      "GET - array of topic objects, POST - a new topic {slug: 'xxx-unique topic', description: 'xxx'}",
    "/api/articles":
      "GET - array of article objects, POST - a new article {username: 'existing username',title: 'xxx',body: 'xxx', topic: 'existing topic'}, accepts queries 'author' (which filters the articles by the username value specified in the query), 'topic', which filters the articles by the topic value specified in the query, 'sort_by', which sorts the articles by any valid column (defaults to date), 'order', which can be set to asc or desc for ascending or descending (defaults to descending), 'limit', which limits the number of responses (defaults to 10) & 'p', stands for page which specifies the page at which to start (calculated using limit)",
    "/api/articles/:article_id":
      "GET - article by article_id, PATCH - update article votes by article_id { inc_votes: ** number of votes to increment **}, DELETE - article by article_id",
    "/api/articles/:article_id/comments":
      "GET - all comments belonging to article_id, POST - new comment by article_id {username: 'xxx', body: 'xxx'}",
    "/api/comments/:comment_id":
      "PATCH - update comment votes by comment_id { inc_votes: ** number of votes to increment **}, DELETE - comment by comment_id, accepts queries 'sort_by', which sorts the articles by any valid column (defaults to created_at), 'order', which can be set to asc or desc for ascending or descending (defaults to descending), 'limit', which limits the number of responses (defaults to 10) & 'p', stands for page which specifies the page at which to start (calculated using limit)",
    "/api/users":
      "GET - array of user objects, POST - new user {username: 'xxx- unique username',avatar_url: 'valid url', name: 'xxx'}",
    "api/users/:username": "GET - user by username"
  };
  return endPointObj;
};

module.exports = { getEndPoints };
