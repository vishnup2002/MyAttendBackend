const express = require("express");
const { test } = require("../../../controllers/api/v1/test");
const router = express.Router();

router.get("/", test);

module.exports = router;
