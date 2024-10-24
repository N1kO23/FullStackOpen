const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has many blogs equals the likes of those combined", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 36);
  });
});

describe("favourite blog", () => {
  test("of empty list is undefined", () => {
    const result = listHelper.favouriteBlog([]);
    assert.strictEqual(result, undefined);
  });

  test("when list has only one blog it is the favourite", () => {
    const result = listHelper.favouriteBlog(listWithOneBlog);
    assert.strictEqual(result, listWithOneBlog[0]);
  });

  test("when list has many blogs favourite is the most liked one", () => {
    const result = listHelper.favouriteBlog(listWithMultipleBlogs);
    assert.strictEqual(result, listWithMultipleBlogs[2]);
  });
});

describe("most blogs by author", () => {
  test("of empty list is undefined", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result.author, undefined);
    assert.strictEqual(result.blogs, undefined);
  });

  test("when list has only one blog, the blost blogged author is that blogs author", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.strictEqual(result.author, listWithOneBlog[0].author);
    assert.strictEqual(result.blogs, 1);
  });

  test("when list has many blogs the most blogs by author is calculated correctly", () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs);
    assert.strictEqual(result.author, "Robert C. Martin");
    assert.strictEqual(result.blogs, 3);
  });
});

describe("most liked author", () => {
  test("of empty list is undefined", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, undefined);
  });

  test("when list has only one blog it is the favourite", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    assert.strictEqual(result.author, "Edsger W. Dijkstra");
    assert.strictEqual(result.likes, 5);
  });

  test("when list has many blogs favourite is the most liked one", () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs);
    assert.strictEqual(result.author, "Edsger W. Dijkstra");
    assert.strictEqual(result.likes, 17);
  });
});
