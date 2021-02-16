const { validationResult } = require('express-validator');

const User = require('../../schema/User');

module.exports = async (req, res) => {
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
};
