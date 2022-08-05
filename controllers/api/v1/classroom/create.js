const Classroom = require("../../../../models/Classroom");
const Session = require("../../../../models/Session");
const Student = require("../../../../models/User/Student");
const { ROOT } = require("../../../../Utils/URLs");

module.exports.create = async (req, res) => {
  const { name } = req.body;
  const tid = req.user._id;
  const classRoom = new Classroom({ name, teacher: tid, students: [] });

  try {
    const savedClassRoom = await classRoom.save();
    return res.status(200).json({
      message: "Classroom created",
      data: savedClassRoom,
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

/*To be done in front end itself*/
module.exports.createJoiningLink = async (req, res) => {
  const { classID } = req.body;
  try {
    let classroom = await Classroom.findById(classID);
    if (!classroom) {
      return res.status(400).json({ message: "Classroom not found" });
    }

    return res.status(200).json({
      message: "link created",
      data: ROOT + `classroom/join?id=${classID}`,
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.join = async (req, res) => {
  const uid = req.user._id;
  const classID = req.query.id;

  try {
    let classroom = await Classroom.findById(classID);
    if (classroom.Students.includes(uid)) {
      return res.status(200).json({
        message: "You are already enrolled in this classroom",
      });
    }
    classroom.Students.push(uid);
    let student = await Student.findById(uid);
    student.classRooms.push(classID);
    await classroom.save();
    await student.save();
    return res.status(200).json({
      message: "Joined class successfully",
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.createSession = async (req, res) => {
  const { name, classID } = req.body;

  const tid = req.user._id;
  const classroom = await Classroom.findById(classID);

  if (!classroom.teacher.equals(tid)) {
    return res.status(400).json({
      message: "Unauthorized",
    });
  }

  let session = new Session({ name, classID });

  await session.save();

  return res.status(200).json({
    message: "Session successfully created",
    data: {
      session,
    },
  });
};

module.exports.joinSession = async (req, res) => {
  const sid = req.query._id;
  const uid = req.user._id;

  const session = await Session.findById(sid);

  const classroom = await Classroom.findById(session.classid);

  if (!classroom.Students.includes(uid)) {
    return res.status(400).json({
      message: "You do not belong to this class",
    });
  }

  if (session.present.includes({ verified: true, student: uid })) {
    return res.status(200).json({
      message: "You already marked attendance",
    });
  }

  if (session.present.includes({ verified: false, student: uid })) {
    return res
      .status(200)
      .json({ message: "Continue with facial recognition" });
  }

  session.present.push({ verified: false, student: uid });
  return res.status(200).json({ message: "Continue with facial recognition" });
};
