const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const deleted = await Blog.findByIdAndDelete(id);
  if (deleted) response.status(204).end();
  else response.status(404).end();
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
