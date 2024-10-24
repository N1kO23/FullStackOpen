const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const { SECRET } = require("../utils/config");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("author", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) return response.status(404).send("user not found");

  const blog = new Blog({
    title: body.title,
    author: user._id,
    url: body.url,
    likes: body.likes,
  });
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) return response.status(404).send("user not found");

  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (blog) {
    if (blog.author.toString() !== decodedToken.id) {
      return res.status(403).json({ error: "Permission denied" });
    }
    const blogId = blog._id;
    await Blog.findByIdAndDelete(blogId);

    user.blogs = user.blogs.filter((blog) => blog.toString() !== blogId);
    await user.save();

    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { title, author, url, likes } = request.body;

  const updatedBlog = {
    title,
    author,
    url,
    likes,
  };

  const blogToUpdate = await Blog.findById(id);
  if (blogToUpdate) {
    const updated = await Blog.findByIdAndUpdate(id, updatedBlog, {
      new: true,
      runValidators: true,
      context: "query",
    });
    response.json(updated);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
