const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  //name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profpic: { type: String, required: false },
  username: { type: String, required: false },

});

module.exports = mongoose.model('User', userSchema);