const Post = require('../../schema/Post')

module.exports = async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json('Post not found');

    // searches through array for like with id, if not found then creates array without the like
    const removeLikeFromPost = post.likes.filter(
      (like) => like.id.toString() !== req.params.like_id.toString()
    );

    const comment = post.comments.find(
      (comment) => comment - _id.toString() === req.params.comment_id.toString()
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
};
