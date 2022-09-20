const Student = require("../../../../../models/User/Student");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");
const Authenticator = require("../../../../../models/Authenticator");
const Session = require("../../../../../models/Session");
const Classroom = require("../../../../../models/Classroom");

const rpName = "MyAttend";
const rpID = "myattend-32f84.web.app";
const origin = `https://myattend-32f84.web.app`;
// const io = require("../../../../../index");

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

module.exports.registrationWA = async (req, res) => {
  const user = req.user;

  if (user.registeredAuth) {
    return res
      .status(400)
      .json({ message: "You have already set up 2 step authentication" });
  }
  const userAuthenticators = await Authenticator.find({ uid: user._id });

  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: user._id,
    userName: user.name,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "indirect",
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",
      // Optional
      // transports: authenticator.transports,
    })),
  });

  user.currentChallenge = options.challenge;
  await user.save();

  return res.status(200).json({
    options,
  });
};

module.exports.verifyRegWA = async (req, res) => {
  const data = req.body;
  const user = req.user;
  const expectedChallenge = user.currentChallenge;

  // console.log(data);

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      credential: data,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified } = verification;

  if (verified) {
    const { registrationInfo } = verification;
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const newAuthenticator = new Authenticator({
      credentialID,
      credentialPublicKey,
      counter,
      uid: user._id,
    });

    user.registeredAuth = true;

    await user.save();
    await newAuthenticator.save();
  }

  return res.status(200).json({ verified });
};

module.exports.authenticationWA = async (req, res) => {
  const user = req.user;

  if (!user.registeredAuth) {
    return res
      .status(400)
      .json({ message: "You have not set up a two step authentication" });
  }

  const userAuthenticators = await Authenticator.find({ uid: user._id });

  const options = generateAuthenticationOptions({
    // Require users to use a previously-registered authenticator
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",
      // Optional
      transports: authenticator.transports,
    })),
    userVerification: "preferred",
  });

  user.currentChallenge = options.challenge;
  await user.save();

  return res.status(200).json({
    options,
  });
};

module.exports.verifyAuthWA = async (req, res) => {
  const data = req.body;
  const user = req.user;

  const expectedChallenge = user.currentChallenge;

  const authenticator = await Authenticator.findOne({
    uid: user._id,
  });

  if (!authenticator) {
    throw new Error(
      `Could not find authenticator ${data.id} for user ${user._id}`
    );
  }

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      credential: data,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified } = verification;
  let message;

  if (verified) {
    const { authenticationInfo } = verification;
    const { newCounter } = authenticationInfo;
    authenticator.counter = newCounter;

    await authenticator.save();

    const sid = req.query.id;
    const uid = req.user._id;

    const session = await Session.findById(sid);
    if (!session) {
      return res.status(400).json({ message: "No session exists" });
    }

    if (!session.active) {
      return res.status(400).json({ message: "Session not active" });
    }

    const classroom = await Classroom.findById(session.classID);

    if (!classroom.Students.includes(uid)) {
      return res.status(400).json({
        message: "You do not belong to this class",
      });
    }

    if (session.present.includes(uid)) {
      return res.status(400).json({
        message: "You already marked attendance",
      });
    }

    session.present.push(uid);

    const student = await Student.findById(uid);
    const clsIndex = student.classRooms.findIndex(({ classID }) =>
      classID.equals(session.classID)
    );

    student.classRooms[clsIndex].joinedSessions.push(sid);

    await student.save();
    await session.save();

    console.log("marked-attendance");

    message = "Marked attendance";
  } else {
    message = "Error in marking attendance";
  }

  return res.status(200).json({
    verified,
    message,
  });
};

module.exports.checkAuthenticated = (req, res) => {
  return res.status(200);
};

module.exports.checkAuthStatus = (req, res) => {
  return res.status(200).json({
    status: req.user.registeredAuth,
  });
};
