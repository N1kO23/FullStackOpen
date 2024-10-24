const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const {
  listWithMultipleBlogs,
  blogsInDb,
  usersInDb,
  nonExistingId,
  initialUsers,
} = require("./test_helper");

const api = supertest(app);

describe("LOGIN test", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    await Blog.insertMany(listWithMultipleBlogs);
    await User.insertMany(initialUsers);

    const passwordHash = await bcrypt.hash("coolpassword", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("can login with correct username and password", async () => {
    const login = {
      username: "root",
      password: "coolpassword",
    };

    const response = await api.post("/api/login").send(login);

    assert.strictEqual(response.status, 200);
  });

  test("error 401 is thrown on invalid username", async () => {
    const login = {
      username: "notroot",
      password: "coolpassword",
    };

    const response = await api.post("/api/login").send(login);

    assert.strictEqual(response.status, 401);
  });

  test("error 401 is thrown on invalid password", async () => {
    const login = {
      username: "root",
      password: "notcoolpassword",
    };

    const response = await api.post("/api/login").send(login);

    assert.strictEqual(response.status, 401);
  });
});

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
    await User.deleteMany({});
    await Blog.insertMany(listWithMultipleBlogs);
    await User.insertMany(initialUsers);

    const passwordHash = await bcrypt.hash("coolpassword", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("a valid blog can be added", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const newBlog = {
      title: "Test Title",
      url: "https://testurl",
      likes: 12,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${bearer}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await blogsInDb();

    const contents = response.map((r) => r.title);

    assert.strictEqual(response.length, listWithMultipleBlogs.length + 1);

    assert(contents.includes("Test Title"));
  });

  test("blog likes default to 0 if not defined", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const newBlog = {
      title: "Test Title",
      url: "https://testurl",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${bearer}`)
      .send(newBlog);

    assert.strictEqual(response.statusCode, 201);

    const likes = response.body.likes;

    assert.strictEqual(likes, 0);
  });

  test("bad request is thrown on missing title", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const newBlog = {
      url: "https://testurl",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${bearer}`)
      .send(newBlog);

    assert.strictEqual(response.statusCode, 400);
  });

  test("bad request is thrown on missing url", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const newBlog = {
      title: "Test Title",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${bearer}`)
      .send(newBlog);

    assert.strictEqual(response.statusCode, 400);
  });

  test("bad request is thrown on missing bearer token", async () => {
    const newBlog = {
      title: "Test Title",
      url: "https://testurl",
      likes: 12,
    };

    const response = await api.post("/api/blogs").send(newBlog);

    assert.strictEqual(response.statusCode, 400);
  });

  test("unauthorized is thrown on invalid bearer token", async () => {
    const newBlog = {
      title: "Test Title",
      url: "https://testurl",
      likes: 12,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", "Bearer isdhgidhnfgojndfghjndfhkjfdljh")
      .send(newBlog);

    assert.strictEqual(response.statusCode, 400);
  });
});

describe("DELETE requests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    await Blog.insertMany(listWithMultipleBlogs);
    await User.insertMany(initialUsers);

    const passwordHash = await bcrypt.hash("coolpassword", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("can delete a single blog", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    await api
      .delete(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .set("Authorization", `Bearer ${bearer}`)
      .expect(204);

    // Katsotaan että määrä on pudonnut yhdellä
    const currentBlogs = await blogsInDb();
    assert.strictEqual(currentBlogs.length, listWithMultipleBlogs.length - 1);
  });

  test("throws 404 if blog with given id is not found", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const nonExistingIdValue = await nonExistingId();
    await api
      .delete(`/api/blogs/${nonExistingIdValue}`)
      .set("Authorization", `Bearer ${bearer}`)
      .expect(404);
  });

  test("throws bad request if id parameter is not uuid", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    await api
      .delete("/api/blogs/fakeid")
      .set("Authorization", `Bearer ${bearer}`)
      .expect(400);
  });

  test("bad request is thrown on missing bearer token", async () => {
    const response = await api.delete(
      `/api/blogs/${listWithMultipleBlogs[0]._id}`
    );

    assert.strictEqual(response.statusCode, 400);
  });

  test("unauthorized is thrown on invalid bearer token", async () => {
    const response = await api
      .delete(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .set("Authorization", "Bearer isdhgidhnfgojndfghjndfhkjfdljh");

    assert.strictEqual(response.statusCode, 400);
  });
});

describe("PUT requests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    await Blog.insertMany(listWithMultipleBlogs);
    await User.insertMany(initialUsers);

    const passwordHash = await bcrypt.hash("coolpassword", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("a valid blog can be updated", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const updated = {
      title: "Test Title",
      url: "https://testurl",
      likes: 12,
    };

    await api
      .put(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .set("Authorization", `Bearer ${bearer}`)
      .send(updated)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const response = await blogsInDb();

    const contents = response.map((r) => r.title);

    // To check that it indeed was updated and not added as new
    assert.strictEqual(response.length, listWithMultipleBlogs.length);

    assert(contents.includes("Test Title"));
  });

  test("blog likes won't reset to 0 if not defined", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const updated = {
      title: "Test Title",
      url: "https://testurl",
    };

    const response = await api
      .put(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .set("Authorization", `Bearer ${bearer}`)
      .send(updated);

    assert.strictEqual(response.statusCode, 200);

    const likes = response.body.likes;

    assert.strictEqual(likes, listWithMultipleBlogs[0].likes);
  });

  test("update is successful even with missing title", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const updated = {
      url: "https://testurl",
    };

    const response = await api
      .put(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .set("Authorization", `Bearer ${bearer}`)
      .send(updated);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.url, "https://testurl");
  });

  test("update is successful even with missing url", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const updated = {
      title: "Test Title",
    };

    const response = await api
      .put(`/api/blogs/${listWithMultipleBlogs[0]._id}`)
      .set("Authorization", `Bearer ${bearer}`)
      .send(updated);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.title, "Test Title");
  });

  test("404 is thrown if blog with id is not found", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const updated = {
      title: "Test Title",
      url: "https://testurl",
      likes: 12,
    };

    const nonExistingIdValue = await nonExistingId();
    await api
      .put(`/api/blogs/${nonExistingIdValue}`)
      .set("Authorization", `Bearer ${bearer}`)
      .send(updated)
      .expect(404);
  });

  test("bad request is thrown if id parameter is not uuid", async () => {
    const bearer = (
      await api.post("/api/login").send({
        username: "root",
        password: "coolpassword",
      })
    ).body.token;

    const updated = {
      title: "Test Title",
      url: "https://testurl",
      likes: 12,
    };

    await api
      .put("/api/blogs/fakeid")
      .set("Authorization", `Bearer ${bearer}`)
      .send(updated)
      .expect(400);
  });
});

describe("USER creation", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("coolpassword", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();

    await Blog.deleteMany({});
    await Blog.insertMany(listWithMultipleBlogs);
    await User.insertMany(initialUsers);
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with too short username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "ro",
      name: "Superuser",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with too short password", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "roaiopsfiuh",
      name: "Superuser",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(
      result.body.error.includes("password must be at least 3 characters long")
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
