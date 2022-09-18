const express = require("express");
const passport = require("passport");
const {
  create,
  createJoiningLink,
  join,
  createSession,
  markAttendance,
  activateAttendance,
  deactivateAttendance,
} = require("../../../../controllers/api/v1/classroom/create");
const {
  fetchClassrooms,
  fetchSessions,
  fetchpresentStudents,
  fetchActiveSessions,
} = require("../../../../controllers/api/v1/classroom/fetch");

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

router.get(
  "/get-classrooms",
  passport.authenticate("teacher", { session: false }),
  fetchClassrooms
);

router.get(
  "/get-sessions",
  passport.authenticate("teacher", { session: false }),
  fetchSessions
);

router.get(
  "/get-active-sessions",
  passport.authenticate("student", { session: false }),
  fetchActiveSessions
);

router.get(
  "/get-present-students",
  passport.authenticate("teacher", { session: false }),
  fetchpresentStudents
);

router.get(
  "/activate-session",
  passport.authenticate("teacher", { session: false }),
  activateAttendance
);

router.get(
  "/deactivate-session",
  passport.authenticate("teacher", { session: false }),
  deactivateAttendance
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
