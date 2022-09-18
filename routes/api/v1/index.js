const express = require("express");
const passport = require("passport");
const { test } = require("../../../controllers/api/v1/test");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/classroom", require("./classroom"));
router.get("/", passport.authenticate("teacher", { session: false }), test);
router.get("/test", test);
module.exports = router;
