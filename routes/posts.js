const express = require('express');
const router = express.Router();
const Post = require('../schema/Post');
const auth = require('../middleware/auth');
const User = require('../schema/User');
const { check, validationResult } = require('express-validator');

router.get('/posts', async (req, res) => {
  try {
    let posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.get('/posts/most_liked', async (req, res) => {
  try {
    let posts = await Post.find().sort({ likes: -1 }); // ordered from the highest to the lowest
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.get('/posts/most_recent', async (req, res) => {
  try {
    let posts = await Post.find().sort({ date: -1 }); // sorted by most recent
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.get('/posts/most_comments', async (req, res) => {
  try {
    let posts = await Post.find().sort({ comments: -1 }); // sorted by most commented
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.get('/posts/:post_id', async (req, res) => {
  try {
    let posts = await Post.findById(req.params.post_id);
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.get('/user_posts/:user_id', async (req, res) => {
  try {
    let posts = await Post.find({ user: req.params.user_id });
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.get('/user_posts/', auth, async (req, res) => {
  try {
    let posts = await Post.find();
    // take user id and auth token and make sure they are both strings
    // if they match then we can show the posts of the user.
    let userPosts = posts.filter(
      (post) => post.user.toString() === req.user.id.toString()
    );
    res.json(userPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.post(
  '/',
  auth,
  [check(' postText', 'Text is required').not().isEmpty()],
  async (req, res) => {
    let { postText } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      let user = await (await User.findById(req.user.id)).select('-password');
      if (!user) return res.status(404).json('User not found');

      let newPost = new Post({
        postText,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      await newPost.save();

      res.json('Post created successfully');
    } catch (error) {}
    return res.status(500).json('Server Error');
  }
);

router.post(
  '/search-for-post',
  [check('searchInput', 'Search is empty').not().isEmpty()],
  async (req, res) => {
    const { searchInput } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      let posts = await Post.find();
      if (searchInput === '' || searchInput === null) {
        res.status(401).json(posts);
      } else {
        let findPostByInput = posts.find(
          (post) =>
            post.postText.toString().toLowerCase().split(' ').join('') ===
            searchInput.toString().toLowerCase().split(' ').join('')
        );
        res.json(findPostByInput);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json('Server Error');
    }
  }
);

router.put('/likes/:post_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json('Post not found');

    // checks to see if the users like count on the post is already more than 0
    if (post.likes.find((like) => like.user.toString() === req.user.id))
      return res.status(401).json('You have already liked this post');

    let newLike = {
      user: req.user.id,
    };

    post.likes.unshift(newLike);

    await post.save();

    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.put(
  '/add-comment/:post_id',
  auth,
  [check('commentText', 'The text is empty').not().isEmpty()],
  async (req, res) => {
    const { commentText } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      let post = await Post.findById(req.params.post_id);
      let user = await User.findById(req.user.id).select('-password');

      if (!user) return res.status(404).json('User not found');

      if (!post) return res.status(404).json('Post not found');

      let newComment = {
        commentText,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json('Comment is added');
    } catch (error) {
      console.error(error);
      return res.status(500).json('Server Error');
    }
  }
);

router.put('/like-comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json('Post not found');

    const postComment = post.comments.find(
      (comment) => comment._id.toString() === req.params.comment_id.toString()
    );

    if (!postComment) return res.status(404).json('Comment not found');

    let newLike = {
      user: req.user.id,
    };

    postComment.likes.unshift(newLike);

    await post.save();

    res.json('Liked the comment');

    if (
      post.comments.likes.find((like) => like.user.toString() === req.user.id)
    )
      return res.status(401).json('You have already liked this post');
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.delete('/delete-post/:post_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json('Post not found');

    if (post.user.toString() !== req.user.id.toString())
      return res.status(401).json('You are not authorised to remove that post');

    await post.remove();
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.delete('/delete-post-like/:post_id/:like_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json('Post not found');

    // searches through array for like with id, if not found then creates array without the like
    const removeLikeFromPost = post.likes.filter(
      (like) => like.id.toString() !== req.params.like_id.toString()
    );

    post.likes = removeLikeFromPost;

    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.delete(
  '/remove-comment/:post_id/:comment_id',
  auth,
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.post_id);

      if (!post) return res.status(404).json('Post not found');

      const removeComment = post.comments.filter(
        (comment) => comment._id.toString() !== req.params.comment_id
      );

      post.comments = removeComment;

      await post.save();

      res.json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json('Server Error');
    }
  }
);

router.delete(
  '/remove-like-from-comment/:post_id/:comment_id/:like_id',
  auth,
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.post_id);

      if (!post) return res.status(404).json('Post not found');

      // searches through array for like with id, if not found then creates array without the like
      const removeLikeFromPost = post.likes.filter(
        (like) => like.id.toString() !== req.params.like_id.toString()
      );

      const comment = post.comments.find(
        (comment) =>
          comment - _id.toString() === req.params.comment_id.toString()
      );

      const removeLikeFromComment = comment.likes.filter(
        (like) => like._id.toString() !== req.params.like_id.toString()
      );

      comment.likes = removeLikeFromComment;

      await post.save();

      res.json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json('Server Error');
    }
  }
);

module.exports = router;
