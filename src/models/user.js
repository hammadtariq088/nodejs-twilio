//models
const mongoose = require("mongoose");

// user schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  token: { type: String },
  isEmailVerified: { type: Boolean },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
