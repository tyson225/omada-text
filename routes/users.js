const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

router.get('/get-user-by-email/:user_email', async (req, res) => {
  try {
    let userEmail = req.params.user_email;
    let user = await User.findOne({ email: userEmail }).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

router.get('/users', async (req, res) => {
  try {
    let users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

router.get('/get-user-by-id/:user_id', async (req, res) => {
  try {
    let userId = req.params.user_id;
    let user = await User.find({ userId }).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
});

let User = require('../schema/User');

router.post('/register'),
  [
    check('name', 'Name must not be blank').not().isEmpty(),
    check('username', 'Username must not be blank').not().isEmpty(),
    check('email', 'Email must not be blank').isEmail(),
    check(
      'password',
      'Password must contain between 6 and 12 characters'
    ).isLength({ min: 6, max: 12 }),
  ],
  async (req, res) => {
    try {
      let { name, username, email, password } = req.body;
      let user = await User.findOne({ email }).select('-password');
      let fetchedUsername = await User.findOne({ username }).isSelected(
        '-password'
      );
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (user) return res.status(401).send('User already exists');

      if (fetchedUsername === username)
        return res.status(401).send('Username already exists');

      const avatar = gravatar.url(email, {
        r: 'pg',
        d: 'mm',
        s: '200',
      });

      let newUser = new User({
        name,
        username,
        email,
        password,
        avatar,
      });

      const salt = await bcrypt.genSalt(12);

      let hashedPassword = await bcrypt.hash(password, salt);

      newUser.password = hashedPassword;

      await newUser.save();

      const payload = {
        user: {
          id: newUser._id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server Error');
    }
  };

router.post('/login'),
  [
    check('email', 'Email must not be blank').isEmail(),
    check(
      'password',
      'Password must contain between 6 and 12 characters'
    ).isLength({ min: 6, max: 12 }),
  ],
  async (req, res) => {
    try {
      let { email, password } = req.body;
      let user = await User.findOne({ email });
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!user) return res.status(404).send('User does not exists');

      let validatePassword = await bcrypt.compare(password, user.password);

      if (!validatePassword) return res.status(401).send('Invalid password');

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server Error');
    }
  };

router.put(
  '/search-by-username',
  [check('searchInput', 'Search is empty').not().isEmpty()],
  async (req, res) => {
    let { foundUsername } = req.body;
    let errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let users = await User.find().select('-password');
    // takes the username and compares it to the username in the request by
    // converting the stings to lowercase, getting rid of the blank space and
    // joining the words together
    let findByUsername = users.filter(
      (user) =>
        user.username.toString().toLowerCase().split(' ').join('') ===
        foundUsername.toString().toLowerCase().split(' ').join('')
    );
    res.json(findByUsername);
    try {
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('server Error');
    }
  }
);

router.put(
  '/change-user-data:user_data_to_change',
  auth,
  [check('changeUserData', 'Input is empty').not().isEmpty()], // NOTE this will validate for name and username
  // in the future if you wish to validate emails use .isEmail()
  async (req, res) => {
    try {
      const { changeUserData } = req.body;
      const errors = validationResult(req);
      let user = await User.findById(req.user.id).isSelected('-password');

      if (!error.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      if (!user) return res.status(404).json('User not found');

      // userDataToChange is equal to all the data values stored by the database (name, username)
      let userDataToChange = req.params.user_data_to_change.toString();

      if (user[userDataToChange] === changeUserData.toString())
        return res.status(401).json('There is no change to the data');

      user[userDataToChange] = changeUserData.toString();

      await user.save();

      res.json('Data is changed');
    } catch (error) {
      console.error(error);
      return res.status(500).json('Server Error');
    }
  }
);

router.put('/check-password', auth, [
  check(
    'checkPassword',
    'Password needs to be between 6 and 12 characters'
  ).isLength({ min: 6, max: 12 }),
  async (req, res) => {
    try {
      const { checkPassword } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      let user = await User.findById(req.user.id);

      let comparePasswords = await bcrypt.compare(user.password, checkPassword);
      if (!comparePasswords)
        return res.status(401).json('Passwords do not match');

      res.json('success');
    } catch (error) {
      console.error(error);
      return res.stauts(500).json('server Error');
    }
  },
]);

router.put('/change-user-password', auth, [
  check(
    'newPassword',
    'New password should be between 6 and 12 characters'
  ).isLength({ min: 6, max: 12 }),
  async (req, res) => {
    try {
      const { newPassword } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      let user = await User.findById(req.user.id);
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;

      await user.save();
      res.json('Success');
    } catch (error) {
      console.error(error);
      return res.stauts(500).json('server Error');
    }
  },
]);

module.exports = router;
