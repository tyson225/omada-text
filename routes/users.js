const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {
  registerUserValidator,
  loginUserValidator,
  searchUserByUsernameValidator,
  changeUserDataValidator,
  checkPasswordValidator,
  changePasswordValidator,
} = require('../middleware/express-validation/userValidator');

const getUserByMiddleware = require('../functions/userFunctions/getUserByMiddleware');
const getUserByEmail = require('../functions/userFunctions/getUserByEmail');
const getUsers = require('../functions/userFunctions/getUsers');
const getUserById = require('../functions/userFunctions/getUserById');
const registerUser = require('../functions/userFunctions/registerUser');
const loginUser = require('../functions/userFunctions/loginUser');
const searchUserByUsername = require('../functions/userFunctions/searchUserByUsername');
const changeUserData = require('../functions/userFunctions/changeUserData');
const checkPassword = require('../functions/userFunctions/checkPassword');
const changePassword = require('../functions/userFunctions/changePassword');

router.get('/', auth, getUserByMiddleware);

router.get('/get-user-by-email/:user_email', getUserByEmail);

router.get('/users', getUsers);

router.get('/get-user-by-id/:user_id', getUserById);

router.post('/register', registerUserValidator, registerUser);

router.post('/login', loginUserValidator, loginUser);

router.put(
  '/search-by-username',
  searchUserByUsernameValidator,
  searchUserByUsername
);

router.put(
  '/change-user-data:user_data_to_change',
  auth,
  changeUserDataValidator,
  changeUserData
);

router.put('/check-password', auth, checkPasswordValidator, checkPassword);

router.put(
  '/change-user-password',
  auth,
  changePasswordValidator,
  changePassword
);

module.exports = router;
