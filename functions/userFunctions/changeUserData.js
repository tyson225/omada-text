const { validationResult } = require('express-validator');
const User = require('../../schema/User');

module.exports = async (req, res) => {
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
};
