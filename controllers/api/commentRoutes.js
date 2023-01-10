const router = require('express').Router();
const { Comment, Blog, User } = require('../../models');
const withAuth = require('../../utils/auth');

// GET method for all comments on a blog
router.get('/', async (req, res) => {
  try {
    const allCommentData = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Blog,
          attributes: ['username'],
        },
      ],
      where: {
        blog_id: req.params.id,
      },
      order: [['date_created', 'ASC']],
    });

    const comments = allCommentData.map((comment) => comment.get({ plain: true }));

    res.render('comments', {
      comments,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET method for one comment via ID
router.get('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment with that id!'});
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//POST method for creating a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//PUT method to update a comment
router.put('/', withAuth, async (req, res) => {
  try {
    const updateComment = await Comment.update(
      {
        content: req.body.commentContent,
      },
      {
        where: {
          id: req.params.id,
        },
      });

      if (!updateComment) {
        res.status(404).json({ message: 'No comment with that id!'});
        return;
      }

      res.status(200).json(updateComment);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//DELETE method to delete a comment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deleteComment = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!deleteComment) {
      res.status(404).json({ message: 'No comment with that id!'});
      return;
    }

    res.status(200).json(deleteComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;