const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  privatekey: String,
  address: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
