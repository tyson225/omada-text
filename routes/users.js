const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const config = require('config');
const jwt = require('jsonwebtoken');

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
      console.log(error.message);
      return res.status(500).send('Server Error');
    }
  };

router.post('/login'),
  async (req, res) => {
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

          if (!validatePassword)
            return res.status(401).send('Invalid password');

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
          console.log(error.message);
          return res.status(500).send('Server Error');
        }
      };
  };

module.exports = router;
