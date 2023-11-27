const experss = require("express");


const router = experss.Router();

router.get("/allaccount", authController.allaccount);
router.post("/crateaccount", authController.crateaccount);

module.exports = router;
