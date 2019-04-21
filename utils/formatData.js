function formatDate(input) {
  let newInput = [...input];
  for (let i = 0; i < input.length; i++) {
    let timestamp = newInput[i].created_at;
    let newDate = new Date(timestamp);
    newInput[i].created_at = newDate;
  }
  return newInput;
}

function renameCommentKeys(inputArray) {
  let oldKey1 = "created_by";
  let newKey1 = "author";
  let oldKey2 = "belongs_to";
  let newKey2 = "article_id";
  const duplicateArray = inputArray.slice();
  duplicateArray.map(function(item) {
    if (oldKey1 in item) {
      let value = item[oldKey1];
      delete item[oldKey1];
      item[newKey1] = value;
    }
  });
  duplicateArray.map(function(item) {
    if (oldKey2 in item) {
      let value = item[oldKey2];
      delete item[oldKey2];
      item[newKey2] = value;
    }
  });
  return duplicateArray;
}

function formatComment(article, formattedCommentKeys) {
  let commentData = [];
  if (formattedCommentKeys.length !== 0) {
    for (let i = 0; i < formattedCommentKeys.length; i++) {
      const newComment = { ...formattedCommentKeys[i] };

      const newArticle = article.find(
        element => element.title === newComment.article_id
      );
      delete newComment.article_id;
      newComment.article_id = newArticle.article_id;
      commentData.push(newComment);
    }
  }
  return commentData;
}

module.exports = { formatDate, renameCommentKeys, formatComment };
