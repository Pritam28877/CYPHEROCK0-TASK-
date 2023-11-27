const experss = require("express");


const router = experss.Router();

router.get("/alltoken", authController.getAllToken);
router.post("/cratetoken", authController.createToken);

module.exports = router;
