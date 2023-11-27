const mongoose = require("mongoose");

const accountModel = new mongoose.Schema({
  privatekey: String,
  address: String,
});

const Account = mongoose.model("Account", accountModel);

module.exports = Account;
