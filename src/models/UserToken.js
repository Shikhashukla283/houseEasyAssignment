const mongoose = require('mongoose');

const userTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

module.exports = UserToken;
