const router = require('express').Router();
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

// POST method for posting a new blog
router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// PUT method to update the blog
router.put('/:id', withAuth, async (req, res) => {
  try {
    const updateBlog = await Blog.update(
      {
        blog_title: req.body.blogTitle,
        blog_content: req.body.blogContent,
      },
      {
        where: {
          id: req.params.id,
        },
      });

      if (!updateBlog) {
        res.status(404).json({ message: 'No blog found with this id!' });
        return;
      }

      res.status(200).json(updateBlog);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// DELETE method to delete a blog
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
