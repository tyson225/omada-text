const Post = require('../../schema/Post')

module.exports = async (req, res) => {
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
};
