exports.up = function(knex, Promise) {
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.string("body", 5000).notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic");
    articlesTable
      .foreign("topic")
      .references("topics.slug")
      .onDelete("CASCADE");
    articlesTable.string("author");
    articlesTable
      .foreign("author")
      .references("users.username")
      .onDelete("CASCADE");
    articlesTable.dateTime("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("articles");
};
