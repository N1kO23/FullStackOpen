const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let totalLikes = 0;
  for (let i = 0; i < blogs.length; i++) {
    totalLikes += blogs[i].likes;
  }
  return totalLikes;
};

const favouriteBlog = (blogs) => {
  let favouriteBlog = blogs[0];
  for (let i = 0; i < blogs.length; i++) {
    if (favouriteBlog.likes < blogs[i].likes) favouriteBlog = blogs[i];
  }
  return favouriteBlog;
};

const mostBlogs = (blogs) => {
  const authorsWithBlogCount = lodash.countBy(blogs, "author");
  const author = lodash.maxBy(
    Object.keys(authorsWithBlogCount),
    (author) => authorsWithBlogCount[author]
  );
  return {
    author,
    blogs: authorsWithBlogCount[author],
  };
};

const mostLikes = (blogs) => {
  const authorsGrouped = lodash.groupBy(blogs, "author");
  const authorLikes = Object.keys(authorsGrouped).map((author) => ({
    author,
    likes: lodash.sumBy(authorsGrouped[author], "likes"),
  }));
  return lodash.maxBy(authorLikes, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
