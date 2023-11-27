const experss = require("express");
const authController = require("../Controllers/authController");

const router = experss.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);

module.exports = router;
