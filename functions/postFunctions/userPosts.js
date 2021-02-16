const Post = require('../../schema/Post')

module.exports = async (req, res) => {
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
};
