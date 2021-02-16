const Post = require('../../schema/Post')

module.exports = async (req, res) => {
  try {
    let posts = await Post.find().sort({ likes: -1 }); // ordered from the highest to the lowest
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
};
