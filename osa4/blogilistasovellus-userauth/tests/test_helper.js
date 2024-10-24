const User = require("../models/user");
const Blog = require("../models/blog");
const { ObjectId } = require("mongoose");

const initialUsers = [
  {
    _id: "671acea17395168591183a66",
    username: "robertcm",
    name: "Robert C. Martin",
    passwordHash:
      "$2b$10$coFHxMl3q2kti6tSdjTQZuSMUQLveLT7OiZrCyJOcO5VVtFrcwqjy",
    blogs: [
      {
        _id: "5a422b891b54a676234d17fa",
      },
      {
        _id: "5a422ba71b54a676234d17fb",
      },
      {
        _id: "5a422bc61b54a676234d17fc",
      },
    ],
    __v: 1,
  },
  {
    _id: "67194f09f1948ee3bb5bbcde",
    username: "chan_m",
    name: "Michael Chan",
    passwordHash:
      "$2b$10$coFHxMl3q2kti6tSdjTQZuSMUQLveLT7OiZrCyJOcO5VVtFrcwqjy",
    blogs: [
      {
        _id: "5a422a851b54a676234d17f7",
      },
    ],
    __v: 1,
  },
  {
    _id: "67194f0bf1948ee3bb5bbce4",
    username: "ewd",
    name: "Edsger W. Dijkstra",
    passwordHash:
      "$2b$10$coFHxMl3q2kti6tSdjTQZuSMUQLveLT7OiZrCyJOcO5VVtFrcwqjy",
    blogs: [
      {
        _id: "5a422aa71b54a676234d17f8",
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
      },
    ],
    __v: 1,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: { _id: "67194f09f1948ee3bb5bbcde" },
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: { _id: "67194f0bf1948ee3bb5bbce4" },
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: { _id: "67194f0bf1948ee3bb5bbce4" },
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: { _id: "671acea17395168591183a66" },
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: { _id: "671acea17395168591183a66" },
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: { _id: "671acea17395168591183a66" },
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const nonExistingId = async () => {
  const user = new User({
    username: "String",
    name: "String",
    passwordHash: "String",
    blogs: [],
  });
  await user.save();
  await user.deleteOne();

  return user._id.toString();
};

module.exports = {
  initialUsers,
  listWithMultipleBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
