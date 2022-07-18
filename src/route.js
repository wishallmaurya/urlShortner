const express = require('express');
const router = express.Router();

//....................Controllers
const controller = require("./controller")

//....................Create /url/shorten
router.post("/url/shorten", controller.createurl);

//...................Get List Of /:urlCode
 router.get("/:urlCode", controller.redirectUrl);

module.exports = router;

