const express = require("express");
const { register } = require("../../../../controllers/api/v1/user/register");
const router = express.Router();

router.post("/register", register);

module.exports = router;
