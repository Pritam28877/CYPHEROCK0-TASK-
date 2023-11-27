const experss = require("express");
const authController = require("./authController");

const router = experss.Router();

router.get("/allaccounts", authController.getAllAccounts);
router.post("/createaccount", authController.createAccount);

module.exports = router;
