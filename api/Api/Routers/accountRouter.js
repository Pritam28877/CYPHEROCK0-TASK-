const experss = require("express");
const authController = require("../Controllers/authController");

const router = experss.Router();

router.get("/allaccount", authController.allaccount);
router.post("/crateaccount", authController.crateaccount);

module.exports = router;
