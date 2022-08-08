const express = require("express");
const passport = require("passport");
const {
  create,
  createJoiningLink,
  join,
  createSession,
  markPresent,
  markAttendance,
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

router.get(
  "/join-classroom",
  passport.authenticate("student", { session: false }),
  join
);

router.post(
  "/create-session",
  passport.authenticate("teacher", { session: false }),
  createSession
);

router.get(
  "/mark-attendance",
  passport.authenticate("student", { session: false }),
  markAttendance
);

module.exports = router;
