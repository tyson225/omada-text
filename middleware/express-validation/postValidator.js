const { check } = require('express-validator');

module.exports.createPostValidator = [
  check(' postText', 'Text is required').not().isEmpty(),
];

module.exports.searchPostValidator = [
  check('searchInput', 'Search is empty').not().isEmpty(),
];

module.exports.addCommentValidator = [
  check('commentText', 'The text is empty').not().isEmpty(),
];
