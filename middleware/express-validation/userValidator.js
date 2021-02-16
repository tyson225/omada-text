const { check } = require('express-validator');

module.exports.registerUserValidator = [
  check('name', 'Name must not be blank').not().isEmpty(),
  check('username', 'Username must not be blank').not().isEmpty(),
  check('email', 'Email must not be blank').isEmail(),
  check(
    'password',
    'Password must contain between 6 and 12 characters'
  ).isLength({ min: 6, max: 12 }),
];

module.exports.loginUserValidator = [
  check('email', 'Email must not be blank').isEmail(),
  check(
    'password',
    'Password must contain between 6 and 12 characters'
  ).isLength({ min: 6, max: 12 }),
];

module.exports.searchUserByUsernameValidator = [
  check('searchInput', 'Search is empty').not().isEmpty(),
];

// NOTE this will validate for name and username in the future if you wish to validate emails use .isEmail()
module.exports.changeUserDataValidator = [
  check('changeUserData', 'Input is empty').not().isEmpty(),
];

module.exports.checkPasswordValidator = [
  check(
    'checkPassword',
    'Password needs to be between 6 and 12 characters'
  ).isLength({ min: 6, max: 12 }),
];

module.exports.changePasswordValidator = [
  check(
    'newPassword',
    'New password should be between 6 and 12 characters'
  ).isLength({ min: 6, max: 12 }),
];
