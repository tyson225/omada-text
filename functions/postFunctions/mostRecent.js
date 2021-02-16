const Post = require('../../schema/Post')

module.exports = async (req, res) => {
  try {
    let posts = await Post.find().sort({ date: -1 }); // sorted by most recent
    res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
};
