const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  username: {
    type: String,
    unique: [true, "Username already taken"],
    required: [true, "name is required"],
  },
  password: {
    type: String,
    required: [true, "name is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: [true, "name is required"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
