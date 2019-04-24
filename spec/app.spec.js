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
          expect(body).to.be.an("array");
        });
    });

    it("GET - status(200) - each article should have the correct keys", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body[0]).to.contain.keys(
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
          expect(body).to.be.an("array");
          expect(body[0].author).to.equal("rogersop");
          expect(body[0].topic).to.equal("mitch");
          expect(body[0].article_id).to.equal(4);
        });
    });
    it("GET - status(200) - articles can be selected by topic", () => {
      return request
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body[0].author).to.equal("rogersop");
          expect(body[0].topic).to.equal("cats");
          expect(body[0].article_id).to.equal(5);
        });
    });
    it("GET - status(200) - articles can be sorted by any valid column - default order desc", () => {
      return request
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body[0].author).to.equal("butter_bridge");
          expect(body[0].topic).to.equal("mitch");
          expect(body[0].article_id).to.equal(12);
        });
    });
    it("GET - status(200) - articles can be put in ascending order - by default date", () => {
      return request
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
          expect(body[0].author).to.equal("butter_bridge");
          expect(body[0].topic).to.equal("mitch");
          expect(body[0].article_id).to.equal(12);
          expect(body[0].created_at).to.equal("1974-11-26T12:21:54.171Z");
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
          expect(body).to.be.an("object");
          expect(body).to.contain.keys(
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
          expect(body.votes).to.equal(102);
          expect(body.title).to.equal("Living in the shadow of a great man");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("GET - status(200) - /:article_id/comments responds with an array of comments by article_id", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("array");
        });
    });
    it("GET - status(200) - /:article_id/comments - each comment should have the correct keys", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).to.contain.keys(
            "comment_id",
            "article_id",
            "votes",
            "body",
            "author",
            "created_at"
          );
          expect(body[0].votes).to.equal(14);
        });
    });
    it("GET - status(200) - /:article_id/comments - default sort by created_at", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body[0].created_at).to.equal("2016-11-22T12:36:03.389Z");
          expect(body[0].comment_id).to.equal(2);
        });
    });
    it("GET - status(200) - /:article_id/comments - can sort by any valid column - default desc order", () => {
      return request
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body[0].author).to.equal("icellusedkars");
          expect(body[0].comment_id).to.equal(13);
        });
    });
    it("GET - status(200) - /:article_id/comments - can sort by any valid column - & asc order", () => {
      return request
        .get("/api/articles/1/comments?sort_by=author&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body[0].author).to.equal("butter_bridge");
          expect(body[0].comment_id).to.equal(2);
        });
    });
    it("POST - status(200) - /:article_id/comments - posts new comment by article_id - responds with posted comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "test body"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body[0]).to.contain.keys(
            "comment_id",
            "article_id",
            "votes",
            "body",
            "author",
            "created_at"
          );
          expect(body[0].article_id).to.equal(1);
          expect(body[0].votes).to.equal(0);
          expect(body[0].body).to.equal("test body");
          expect(body[0].author).to.equal("butter_bridge");
        });
    });
  });
  describe('"/api/comments/:comment_id', () => {
    it("PATCH - status(200) - /:comment_id accepts a body of inc_votes and returns updated comment", () => {
      return request
        .patch("/api/comments/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(18);
          expect(body.comment.author).to.equal("butter_bridge");
        });
    });
    it("DELETE - status(204) - /:comment_id - deletes a comment by Id", () => {
      return request.delete("/api/comments/1").expect(204);
    });
    xit("DELETE - status(404) - /:comment_id - for a non-existent comment_id", () => {
      return request
        .delete("/api/comments/20")
        .expect(404)
        .then(({ body }) => {
          console.log(body, "<--- body");
          expect(body.msg).to.equal("comment_id not found");
        });
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
          expect(body).to.contain.keys("username", "avatar_url", "name");
        });
    });
  });
  describe("ERRORS - Route Not Found", () => {
    it("Root Path/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("/api/articles/:article_id/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/articles/1/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("/api/comments/:comment_id/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/comments/1/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("/api/topics/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
      return request
        .get("/api/topics/xyz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
    it("/api/users/:username/xyz - Status: 404 - handles Route Not Found when given invalid path", () => {
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
    it("POST /api/articles - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .post("/api/articles")
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
    it("DELETE /api/articles/:article_id - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .delete("/api/articles/1")
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
    it("GET /api/comments/:comment_id - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .get("/api/comments/1")
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
    it("DELETE /api/users/:username - Status: 405 - handles Method Not Allowed when given an invalid method for route", () => {
      return request
        .delete("/api/users/butter_bridge")
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
          expect(body.msg).to.equal("article_id not found");
        });
    });
    it("PATCH - status 404 - /articles/:articleId for a non-existent article_id", () => {
      return request
        .patch("/api/articles/50")
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("article_id not found");
        });
    });
    it("GET - status 404 - /articles/:articleId/comments for a non-existent article_id", () => {
      return request
        .get("/api/articles/50/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("article_id not found");
        });
    });
    it("GET - status 400 - /articles/:articleId for a bad article_id (dog)", () => {
      return request
        .get("/api/articles/dog")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad article_id");
        });
    });
  });
  describe("ERRORS - Bad Queries", () => {
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
        .get("/api/articles?author=dinosaurs")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            "no articles in database for selected author"
          );
        });
    });
  });
  xdescribe("", () => {});
});
