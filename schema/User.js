const mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
});

// Exports the user schema and sends the data to the user collection in mongoDB
module.exports = UserSchema = mongoose.model('user', UserSchema);
