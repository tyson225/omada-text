const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../../schema/User');

module.exports = async (req, res) => {
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
};
