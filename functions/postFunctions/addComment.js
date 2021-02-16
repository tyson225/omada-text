const { validationResult }= require('express-validator');
const Post = require('../../schema/Post')
const User = require('../../schema/User');

module.exports = async (req, res) => {
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
};
