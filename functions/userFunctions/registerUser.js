const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const gravatar = require('gravatar');

const User = require('../../schema/User');

module.exports = async (req, res) => {
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
