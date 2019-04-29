process.env.NODE_ENV = "test";

const { expect } = require("chai");
const supertest = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

const request = supertest(app);

describe.only("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
  });
  describe("/api/topics", () => {
    it("GET status:200 - responds with an array of topic objects", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
        });
    });
    it("GET - status(200) - each topic should have the correct keys", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
          expect(body.topics[0]).to.contain.keys("description", "slug");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET status:200 - responds with an array of article objects", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
        });
    });

    it("GET - status(200) - each article should have the correct keys", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0]).to.contain.keys(
            "article_id",
            "title",
            "votes",
            "topic",
            "created_at",
            "author",
            "comment_count"
          );
        });
    });
    it("GET - status(200) - articles can be selected by author", () => {
      return request
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0].author).to.equal("rogersop");
          expect(body.articles[0].topic).to.equal("mitch");
          expect(body.articles[0].article_id).to.equal(4);
        });
    });
    it("GET - status(200) - articles can be selected by topic", () => {
      return request
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0].author).to.equal("rogersop");
          expect(body.articles[0].topic).to.equal("cats");
          expect(body.articles[0].article_id).to.equal(5);
        });
    });
    it("GET - status(200) - articles can be sorted by any valid column - default order desc", () => {
      return request
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0].author).to.equal("butter_bridge");
          expect(body.articles[0].topic).to.equal("mitch");
          expect(body.articles[0].article_id).to.equal(12);
        });
    });
    it("GET - status(200) - articles can be put in ascending order - by default date", () => {
      return request
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0].author).to.equal("butter_bridge");
          expect(body.articles[0].topic).to.equal("mitch");
          expect(body.articles[0].article_id).to.equal(12);
          expect(body.articles[0].created_at).to.equal(
            "1974-11-26T12:21:54.171Z"
          );
        });
    });
  });
  describe("/api/articles/:articleId", () => {
    it("GET status:200 - responds with an article object", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });

    it("GET - status(200) - the article object should have the correct keys", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("object");
          expect(body.article).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at",
            "comment_count"
          );
        });
    });
    it("PATCH - status(200) - /:article_id accepts a body of inc_votes and returns updated article", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(102);
          expect(body.article.title).to.equal(
            "Living in the shadow of a great man"
          );
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("GET - status(200) - /:article_id/comments responds with an array of comments by article_id", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
        });
    });
    it("GET - status(200) - /:article_id/comments - each comment should have the correct keys", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0]).to.contain.keys(
            "comment_id",
            "votes",
            "body",
            "author",
            "created_at"
          );
          expect(body.comments[0].votes).to.equal(14);
        });
    });
    it("GET - status(200) - /:article_id/comments - default sort by created_at", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0].created_at).to.equal(
            "2016-11-22T12:36:03.389Z"
          );
          expect(body.comments[0].comment_id).to.equal(2);
        });
    });
    it("GET - status(200) - /:article_id/comments - can sort by any valid column - default desc order", () => {
      return request
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0].author).to.equal("icellusedkars");
          expect(body.comments[0].comment_id).to.equal(13);
        });
    });
    it("GET - status(200) - /:article_id/comments - can sort by any valid column - & asc order", () => {
      return request
        .get("/api/articles/1/comments?sort_by=author&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0].author).to.equal("butter_bridge");
          expect(body.comments[0].comment_id).to.equal(2);
        });
    });
    it("POST - status(201) - /:article_id/comments - posts new comment by article_id - responds with posted comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "test body"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).to.contain.keys(
            "comment_id",
            "article_id",
            "votes",
            "body",
            "author",
            "created_at"
          );
          expect(body.comment.article_id).to.equal(1);
          expect(body.comment.votes).to.equal(0);
          expect(body.comment.body).to.equal("test body");
          expect(body.comment.author).to.equal("butter_bridge");
        });
    });
  });
  describe('"/api/comments/:comment_id', () => {
    it("PATCH - status(200) - /:comment_id accepts a body of inc_votes and returns updated comment", () => {
      return request
        .patch("/api/comments/1")
        .send({ inc_votes: "2" })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(18);
          expect(body.comment.author).to.equal("butter_bridge");
        });
    });
    it("DELETE - status(204) - /:comment_id - deletes a comment by Id", () => {
      return request.delete("/api/comments/1").expect(204);
    });
  });
  describe('"/api/users/:username', () => {
    it("GET status:200 - responds with a user object", () => {
      return request
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });
    it("GET - status(200) - the user object should have the correct keys", () => {
      return request
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
          expect(body.user).to.contain.keys("username", "avatar_url", "name");
        });
    });
  });
  describe("ERRORS - Route Not Found", () => {
    it("GET - Root Path/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("GET - api/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("GET /api/articles/:article_id/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/articles/1/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("GET - /api/comments/:comment_id/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/comments/1/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("GET - /api/topics/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/topics/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("GET - /api/users/:username/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/users/1/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
  });
  describe("ERRORS - Method Not Allowed", () => {
    it("POST /api - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .post("/api")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("DELETE /api - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .delete("/api")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("PATCH /api - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .patch("/api")
        .send({ hello: 1 })
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("DELETE /api/articles - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .delete("/api/articles")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("PATCH /api/articles - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .patch("/api/articles")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("POST /api/articles/:article_id - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .post("/api/articles/1")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("DELETE /api/articles/:article_id/comments - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .delete("/api/articles/1/comments")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("PATCH /api/articles/:article_id/comments - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .patch("/api/articles/1/comments")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("GET /api/comments/:comment_id - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .get("/api/comments/1")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("POST /api/comments/:comment_id - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .post("/api/comments/1")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("DELETE /api/topics - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .delete("/api/topics")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("PATCH /api/topics - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .patch("/api/topics")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("DELETE /api/users/:username - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .delete("/api/users/butter_bridge")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("PATCH /api/users/:username - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .patch("/api/users/butter_bridge")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("POST /api/users/:username - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .post("/api/users/butter_bridge")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("DELETE /api/users/ - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .delete("/api/users/butter_bridge")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("PATCH /api/users/ - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .patch("/api/users/butter_bridge")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
  });
  describe("ERRORS - 404 NOT FOUND", () => {
    it("GET - status 404 - /articles/:articleId for a non-existent article_id (50)", () => {
      return request
        .get("/api/articles/50")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Id Not Found");
        });
    });
    it("PATCH - status 404 - /articles/:articleId for a non-existent article_id", () => {
      return request
        .patch("/api/articles/50")
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Article Id Not Found");
        });
    });
    it("GET - status 404 - /articles/:articleId/comments for a non-existent article_id", () => {
      return request
        .get("/api/articles/50/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Article Id Not Found");
        });
    });
    it("GET - status 400 - /articles/:articleId for a bad article_id (dog)", () => {
      return request
        .get("/api/articles/dog")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
  });
  describe("ERRORS - /api/articles - Bad Queries", () => {
    it("GET /api/articles - sort_by a column that doesn't exist", () => {
      return request
        .get("/api/articles?sort_by=dinosaurs")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("sort_by parameter doesn't exist");
        });
    });
    it("GET /api/articles - query by author that doesn't exist in the database", () => {
      return request
        .get("/api/articles?author=not-a-topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Query Does Not Exist In Database");
        });
    });
    it("GET /api/articles?topic= - query by topic that doesn't exist in the database", () => {
      return request
        .get("/api/articles?topic=not-a-topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Query Does Not Exist In Database");
        });
    });
  });
  describe("/api/comments/:commentId", () => {
    it("DELETE - status(404) - /:comment_id - for well-formed but non-existent comment_id", () => {
      return request
        .delete("/api/comments/20")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("comment_id not found");
        });
    });
    it("DELETE - status(400) - /:comment_id - for a bad comment_id", () => {
      return request
        .delete("/api/comments/xyz")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("PATCH - status(400) - /:comment_id - for a bad comment_id", () => {
      return request
        .patch("/api/comments/xyz")
        .send({ inc_votes: "2" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("PATCH - status(404) - /:comment_id - for well-formed but non-existent comment_id", () => {
      return request
        .patch("/api/comments/20")
        .send({ inc_votes: "2" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Comment Id Not Found");
        });
    });
    it("PATCH - status(400) - /:comment_id - invalid votes body", () => {
      return request
        .patch("/api/comments/10")
        .send({ inc_votes: "potato" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("PATCH - status(200) - /:comment_id - no patch body", () => {
      return request
        .patch("/api/comments/10")
        .send({})
        .expect(200);
    });
    it("PATCH - status(400) - /:comment_id - inc_votes not in body", () => {
      return request
        .patch("/api/comments/10")
        .send({ in_vot: "2" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("inc_votes not in request body");
        });
    });
  });
  describe("/api/articles/:articleId", () => {
    it("GET - status(404) - /:articleId/comments - for well-formed but non-existent article_id", () => {
      return request
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Article Id Not Found");
        });
    });
    it("GET - status(400) - /:comment_id/comments - for a bad comment_id", () => {
      return request
        .get("/api/articles/xyz/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("PATCH - status(400) - /articles/:article_id - inc_votes not in body", () => {
      return request
        .patch("/api/articles/10")
        .send({ in_vot: "2" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("inc_votes not in request body");
        });
    });
    it("PATCH - status(400) - /articles/:article_id - invalid votes body", () => {
      return request
        .patch("/api/articles/10")
        .send({ inc_votes: "potato" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
  });
  describe("/api/articles/:articleId/comments", () => {
    it("GET - status(200) - /articles/:article_id/comments - article exists but has no comments", () => {
      return request
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({ comments: [] });
        });
    });
    it("POST - status(404) - NOT FOUND when post contains valid articleId that doesn't exist in database", () => {
      const newComment = {
        username: "butter_bridge",
        body: "test body 5"
      };
      return request
        .post("/api/articles/10000/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("Invalid Article Id");
        });
    });
    it("POST - status(400) - /articles/:article_id/comments - invalid post body (no username)", () => {
      const newComment = {
        user: "butter_bridge",
        body: "ddd"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("POST - status(400) - /articles/:article_id/comments - invalid post body (no body)", () => {
      const newComment = {
        username: "butter_bridge",
        bod: "ddd"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("POST - status(400) - /articles/:article_id/comments - username not in database", () => {
      const newComment = {
        username: "al",
        body: "test body"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Username or Topic");
        });
    });
    it("POST - status(400) - /articles/:article_id/comments - extra key(s) on post body", () => {
      const newComment = {
        username: "al",
        body: "test body",
        sex: "male"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
  });
  describe("/api/users/:username", () => {
    it("GET - status(404) /api/users/:username - username doesnt exist", () => {
      return request
        .get("/api/users/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("User Not Found");
        });
    });
  });
  describe("/api/articles", () => {
    it("POST - status(200) /api/articles - responds with the correct article object", () => {
      const newArticle = {
        username: "butter_bridge",
        title: "Hot Tubs",
        body: "test body",
        topic: "mitch"
      };
      return request
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).to.be.an("object");
          expect(body.article).to.contain.keys(
            "article_id",
            "title",
            "votes",
            "topic",
            "created_at",
            "author"
          );
        });
    });
    it("POST - status(400) /api/articles - missing key(s) on post body", () => {
      const newArticle = {
        username: "butter_bridge",
        title: "Hot Tubs",
        body: "test body"
      };
      return request
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("POST - status(400) /api/articles - extra key(s) on post body", () => {
      const newArticle = {
        username: "butter_bridge",
        title: "Hot Tubs",
        body: "test body",
        topic: "mitch",
        score: "25"
      };
      return request
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("POST - status(404) /api/articles - username not in database", () => {
      const newArticle = {
        username: "not-a-username",
        title: "Hot Tubs",
        body: "test body",
        topic: "mitch"
      };
      return request
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Username or Topic");
        });
    });
    it("POST - status(404) /api/articles - topic not in database", () => {
      const newArticle = {
        username: "butter_bridge",
        title: "Hot Tubs",
        body: "test body",
        topic: "not-a-topic"
      };
      return request
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Username or Topic");
        });
    });
  });
  describe("/api/articles/:articleId", () => {
    it("DELETE - status(404) - /:articleId - for well-formed but non-existent articleId", () => {
      return request
        .delete("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("article_id not found");
        });
    });
    it("DELETE - status(400) - /:articleId - for a bad articleId", () => {
      return request
        .delete("/api/articles/xyz")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
  });
  describe("/api/topics", () => {
    it("POST - status(200) /api/topics - responds with the correct topic object", () => {
      const newTopic = {
        slug: "potatoes",
        description: "test description"
      };
      return request
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.be.an("object");
          expect(body.topic).to.contain.keys("slug", "description");
        });
    });
    it("POST - status(400) /api/topics - missing key(s) on post body", () => {
      const newTopic = {
        description: "test description"
      };
      return request
        .post("/api/topics")
        .send(newTopic)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Missing Or Duplicate Topic");
        });
    });
    it("POST - status(400) /api/topics - extra key(s) on post body", () => {
      const newTopic = {
        description: "butter_bridge",
        slug: "potatoes",
        score: "25"
      };
      return request
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid Input");
        });
    });
    it("POST - status(404) /api/articles - slug/topic already exists in database", () => {
      const newTopic = {
        topic: "mitch",
        description: "test description"
      };
      return request
        .post("/api/topics")
        .send(newTopic)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Missing Or Duplicate Topic");
        });
    });
  });
});

// tests for POST /api/users
// tests for GET /api/users - not done yet
