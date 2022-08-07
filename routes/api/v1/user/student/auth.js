const express = require("express");
const passport = require("passport");
const {
  register,
  createSession,
  registrationWA,
  verifyRegWA,
  authenticationWA,
  verifyAuthWA,
} = require("../../../../../controllers/api/v1/user/Student/auth");
const router = express.Router();

router.post("/register", register);
router.post("/create-session", createSession);
router.get(
  "/generate-registration-option",
  passport.authenticate("student", { session: false }),
  registrationWA
);
router.post(
  "/verify-registration",
  passport.authenticate("student", { session: false }),
  verifyRegWA
);
router.get(
  "/generate-authentication-option",
  passport.authenticate("student", { session: false }),
  authenticationWA
);
router.post(
  "/verify-authentication",
  passport.authenticate("student", { session: false }),
  verifyAuthWA
);

module.exports = router;
