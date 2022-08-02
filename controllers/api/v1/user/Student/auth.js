const Student = require("../../../../../models/User/Student");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

dotenv.config();

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await Student.findOne({ email });

  if (existingUser) {
    return res.status(409).send({
      message: "Email already exists!!",
    });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new Student({ name, email, password: hashPassword });

  try {
    const savedUser = await user.save();
    //sign-in-successful
    return res.status(200).json({
      message: "Account created and Sign-in successful.. find the token",
      data: {
        token: jwt.sign(savedUser.toJSON(), process.env.SECRET_KEY, {
          expiresIn: "9999999",
        }),
      },
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.createSession = async (req, res) => {
  try {
    let user = await Student.findOne({ email: req.body.email });

    if (!user) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }
    const validPasswrd = await bcrypt.compare(req.body.password, user.password);
    if (!validPasswrd) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }

    //sign-in-successful
    return res.status(200).json({
      message: "Sign-in successful.. find the token",
      data: {
        token: jwt.sign(user.toJSON(), process.env.SECRET_KEY, {
          expiresIn: "9999999",
        }),
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
