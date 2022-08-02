const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const JWTStrategy = require("passport-jwt").Strategy;

const dotenv = require("dotenv");
const Student = require("../models/User/Student");
const Teacher = require("../models/User/Teacher");

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  "teacher",
  new JWTStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await Teacher.findById(jwt_payload._id);

      if (user) {
        //console.log(user);
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);

passport.use(
  "student",
  new JWTStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await Student.findById(jwt_payload._id);

      if (user) {
        //console.log(user);
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);

module.exports = passport;
