process.env.NODE_ENV = "test";

const { expect } = require("chai");
const {
  formatDate,
  renameCommentKeys,
  formatComment
} = require("../utils/formatData");

describe("#formatDate", () => {
  it("will replace the timestamp as an instance of a Date when passed an array with one object", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const actual = formatDate(input);

    expect(actual[0].created_at).to.be.an.instanceOf(Date);
  });
  it("will replace the timestamp as an instance of a Date when passed an array of 2 objects", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171
      }
    ];
    const actual = formatDate(input);

    expect(actual[0].created_at).to.be.an.instanceOf(Date);
    expect(actual[1].created_at).to.be.an.instanceOf(Date);
  });
  it("will replace the timestamp as an instance of a Date when passed an array of multiple objects", () => {
    const input = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 123456789101
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 876543212345
      },
      {
        title: "Does Mitch predate civilisation?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
        created_at: 786546789345
      }
    ];
    const actual = formatDate(input);

    expect(actual[0].created_at).to.be.an.instanceOf(Date);
    expect(actual[1].created_at).to.be.an.instanceOf(Date);
    expect(actual[2].created_at).to.be.an.instanceOf(Date);
  });
});
describe("#renameCommentKeys", () => {
  it("changes the keys of created_by and belongs_to to author and article_id when passed an array of one object - & does not mutate the original array", () => {
    const input = [
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      }
    ];
    const expected = [
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        article_id: "Making sense of Redux",
        author: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      }
    ];
    const actual = renameCommentKeys(input);
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(expected);
  });
  it("changes the keys of created_by and belongs_to to author and article_id when passed an array of multiple objects", () => {
    const input = [
      {
        body:
          "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.",
        belongs_to: "22 Amazing open source React projects",
        created_by: "grumpy19",
        votes: 3,
        created_at: 1504183900263
      },
      {
        body:
          "Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "happyamy2016",
        votes: 4,
        created_at: 1467709215383
      }
    ];
    const expected = [
      {
        body:
          "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.",
        article_id: "22 Amazing open source React projects",
        author: "grumpy19",
        votes: 3,
        created_at: 1504183900263
      },
      {
        body:
          "Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.",
        article_id:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        author: "happyamy2016",
        votes: 4,
        created_at: 1467709215383
      }
    ];
    const actual = renameCommentKeys(input);
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(expected);
  });
});
describe("#formatComment", () => {
  it("formats one comment when passed one article", () => {
    const articleInput = [
      {
        article_id: 5,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const commentInput = [
      {
        body:
          "Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.",
        article_id: "Living in the shadow of a great man",
        author: "happyamy2016",
        votes: 4,
        created_at: 1467709215383
      }
    ];
    const expectedOutput = [
      {
        body:
          "Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.",
        article_id: 5,
        author: "happyamy2016",
        votes: 4,
        created_at: 1467709215383
      }
    ];
    const result = formatComment(articleInput, commentInput);
    expect(result).to.eql(expectedOutput);
    expect(result).to.not.equal(expectedOutput);
  });
  it("formats multiple comments when passed multiple articles", () => {
    const articleInput = [
      {
        article_id: 5,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 23,
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 1500584273256
      }
    ];
    const commentInput = [
      {
        body:
          "Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.",
        article_id: "Living in the shadow of a great man",
        author: "happyamy2016",
        votes: 4,
        created_at: 1467709215383
      },
      {
        body:
          "Facilis corporis animi et non non minus nisi. Magnam et sequi dolorum fugiat ab assumenda.",
        article_id:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        author: "tickle122",
        votes: 12,
        created_at: 1468201097851
      }
    ];
    const expectedOutput = [
      {
        body:
          "Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.",
        article_id: 5,
        author: "happyamy2016",
        votes: 4,
        created_at: 1467709215383
      },
      {
        body:
          "Facilis corporis animi et non non minus nisi. Magnam et sequi dolorum fugiat ab assumenda.",
        article_id: 23,
        author: "tickle122",
        votes: 12,
        created_at: 1468201097851
      }
    ];
    const result = formatComment(articleInput, commentInput);
    expect(result).to.eql(expectedOutput);
    expect(result).to.not.equal(expectedOutput);
  });
});
