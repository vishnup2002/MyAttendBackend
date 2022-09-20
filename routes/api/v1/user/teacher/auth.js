const express = require("express");
const passport = require("passport");
const {
  checkAuthenticated,
} = require("../../../../../controllers/api/v1/user/Student/auth");
const {
  register,
  createSession,
} = require("../../../../../controllers/api/v1/user/Teacher/auth");
const router = express.Router();

router.post("/register", register);
router.post("/create-session", createSession);

router.get(
  "/check-authenticated",
  passport.authenticate("teacher", { session: false }),
  checkAuthenticated
);

module.exports = router;
