\c ncnews_test

--SELECT articles.article_id, author, title, topic, created_at, votes, COUNT(comments.article_id) AS comment_count FROM articles;
--LEFT JOIN comments ON comments.article_id = articles.article_id
--GROUP BY articles.article_id, comments.author;

SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id;

--SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM articles
--LEFT JOIN comments ON articles.article_id = comments.article_id
--GROUP BY articles.article_id;

--SELECT author, title, article_id, topic, created_at, votes FROM articles;



