const express = require("express");
const {
  register,
  createSession,
} = require("../../../../../controllers/api/v1/user/Teacher/auth");
const router = express.Router();

router.post("/register", register);
router.post("/create-session", createSession);

module.exports = router;
