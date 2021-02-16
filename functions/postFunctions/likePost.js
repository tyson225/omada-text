const Post = require('../../schema/Post')

module.exports = async (req, res) => {
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
};
