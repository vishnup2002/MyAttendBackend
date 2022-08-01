const express = require("express");
const { test } = require("../../../controllers/api/v1/test");
const router = express.Router();

router.use("/user", require("./user"));
router.get("/", test);

module.exports = router;
