const experss = require("express");
const authController = require("../Controllers/authController");

const router = experss.Router();

router.get("/alltoken", authController.getAllToken);
router.post("/cratetoken", authController.createToken);

module.exports = router;
