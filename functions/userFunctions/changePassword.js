const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../../schema/User');

module.exports = async (req, res) => {
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
};
