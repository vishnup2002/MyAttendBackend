const { application } = require("express");
const express = require("express");
const student = require("./student/auth");
const teacher = require("./teacher/auth");

const router = express.Router();

router.use("/student", student);
router.use("/teacher", teacher);

module.exports = router;
