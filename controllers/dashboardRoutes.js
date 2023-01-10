const router = require('express').Router();
const { Blog, User } = require('../models');
const withAuth = require('../utils/auth');

// GET method for only showing blogs that the user_id matches the blog they created while logged in
router.get('/', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: {
        model: User,
        attributes: ['username'],
      },
      where: {
        user_id: req.session.user_id,
      },
    });

    const userBlog = blogData.map((blog) => blog.get({ plain: true }));

    res.render('dashboard', {
      userBlog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Routes to newBlog page for writing new blogs
router.get('/newBlog', withAuth, async (req, res) => {
  if (req.session.logged_in) {
    res.render('newBlog', { logged_in: req.session.logged_in });
  } else {
    res.redirect('/login');
  }
});

// Routes to updateBlog via ID where the attributes are the id and user_id of the writer
router.get('/updateBlog/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    const blog = blogData.get({ plain: true });

    res.render('updateBlog', {
      blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;