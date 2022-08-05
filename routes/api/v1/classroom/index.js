const express = require("express");
const passport = require("passport");
const {
  create,
  createJoiningLink,
  join,
  createSession,
} = require("../../../../controllers/api/v1/classroom/create");

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("teacher", { session: false }),
  create
);

router.post(
  "/create-join-link",
  passport.authenticate("teacher", { session: false }),
  createJoiningLink
);

router.get("/join", passport.authenticate("student", { session: false }), join);

router.post(
  "/create-session",
  passport.authenticate("teacher", { session: false }),
  createSession
);

module.exports = router;
