exports.up = function(knex, Promise) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author");
    commentsTable.foreign("author").references("users.username");
    commentsTable.integer("article_id");
    commentsTable.foreign("article_id").references("articles.article_id");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.dateTime("created_at").defaultTo(knex.fn.now());
    commentsTable.string("body", 5000).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("comments");
};
