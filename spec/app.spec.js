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
          expect(body.article.votes).to.equal(102);
          expect(body.article.title).to.equal(
            "Living in the shadow of a great man"
          );
        });
    });
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
  });
});
