const { validationResult }= require('express-validator');
const Post = require('../../schema/Post')
const User = require('../../schema/User');

module.exports = async (req, res) => {
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
};
