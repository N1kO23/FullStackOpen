const { test, after, beforeEach, describe, expect } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const app = require("../app");

const api = supertest(app);

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

describe("GET requests", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs are returned with id instead of _id", async () => {
    const result = await api.get("/api/blogs");

    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(typeof result.body[0].id, "string"); // Tarkistetaan että id on määritelty ja tyyppiä string
    assert.strictEqual(result.body[0]._id, undefined);
  });
});

describe("POST requests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(listWithMultipleBlogs);
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Test Title",
      author: "Test user",
      url: "https://testurl",
      likes: 12,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const contents = response.body.map((r) => r.title);

    assert.strictEqual(response.body.length, listWithMultipleBlogs.length + 1);

    assert(contents.includes("Test Title"));
  });

  test("blog likes default to 0 if not defined", async () => {
    const newBlog = {
      title: "Test Title",
      author: "Test user",
      url: "https://testurl",
    };

    const response = await api.post("/api/blogs").send(newBlog);

    assert.strictEqual(response.statusCode, 201);

    const likes = response.body.likes;

    assert.strictEqual(likes, 0);
  });

  test("bad request is thrown on missing title", async () => {
    const newBlog = {
      author: "Test user",
      url: "https://testurl",
    };

    const response = await api.post("/api/blogs").send(newBlog);

    assert.strictEqual(response.statusCode, 400);
  });

  test("bad request is thrown on missing url", async () => {
    const newBlog = {
      title: "Test Title",
      author: "Test user",
    };

    const response = await api.post("/api/blogs").send(newBlog);

    assert.strictEqual(response.statusCode, 400);
  });
});

describe("DELETE requests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(listWithMultipleBlogs);
  });

  test("can delete a single blog", async () => {
    await api.delete(`/api/blogs/${listWithMultipleBlogs[0]._id}`).expect(204);

    // Katsotaan että määrä on pudonnut yhdellä
    const currentBlogs = await api.get("/api/blogs");
    assert.strictEqual(
      currentBlogs.body.length,
      listWithMultipleBlogs.length - 1
    );
  });

  test("throws 404 if blog with given id is not found", async () => {
    await api.delete("/api/blogs/671aa9c2f1d06b440b8d5826").expect(404);
  });

  test("throws bad request if id parameter is not uuid", async () => {
    await api.delete("/api/blogs/fakeid").expect(400);
  });
});

describe("PUT requests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(listWithMultipleBlogs);
  });

  test("a valid blog can be updated", async () => {
    const updated = {
      title: "Test Title",
      author: "Test user",
      url: "https://testurl",
      likes: 12,
    };

    await api
      .put(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .send(updated)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const contents = response.body.map((r) => r.title);

    // To check that it indeed was updated and not added as new
    assert.strictEqual(response.body.length, listWithMultipleBlogs.length);

    assert(contents.includes("Test Title"));
  });

  test("blog likes won't reset to 0 if not defined", async () => {
    const updated = {
      title: "Test Title",
      author: "Test user",
      url: "https://testurl",
    };

    const response = await api
      .put(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .send(updated);

    assert.strictEqual(response.statusCode, 200);

    const likes = response.body.likes;

    assert.strictEqual(likes, listWithMultipleBlogs[0].likes);
  });

  test("update is successful even with missing title", async () => {
    const updated = {
      author: "Test user",
      url: "https://testurl",
    };

    const response = await api
      .put(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .send(updated);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.author, "Test user");
  });

  test("update is successful even with missing url", async () => {
    const updated = {
      title: "Test Title",
      author: "Test user",
    };

    const response = await api
      .put(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .send(updated);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.author, "Test user");
  });

  test("404 is thrown if blog with id is not found", async () => {
    const updated = {
      title: "Test Title",
      author: "Test user",
      url: "https://testurl",
      likes: 12,
    };

    await api
      .put("/api/blogs/671aa9c2f1d06b440b8d5826")
      .send(updated)
      .expect(404);
  });

  test("bad request is thrown if id parameter is not uuid", async () => {
    const updated = {
      title: "Test Title",
      author: "Test user",
      url: "https://testurl",
      likes: 12,
    };

    await api.put("/api/blogs/fakeid").send(updated).expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
