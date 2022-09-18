const Classroom = require("../../../../models/Classroom");
const Session = require("../../../../models/Session");
const Student = require("../../../../models/User/Student");
const Teacher = require("../../../../models/User/Teacher");

module.exports.fetchClassrooms = async (req, res) => {
  const classrooms = await Classroom.find({ teacher: req.user._id }).populate(
    "teacher",
    "name"
  );
  const user = await Teacher.findById(req.user._id);

  return res.status(200).json({
    data: {
      userName: user.name,
      classrooms,
    },
  });
};

module.exports.fetchSessions = async (req, res) => {
  const classID = req.query.classid;
  const className = await Classroom.findById(classID);
  const sessions = await Session.find({ classID });

  return res.status(200).json({
    data: {
      sessions,
      className: className.name,
    },
  });
};

module.exports.fetchpresentStudents = async (req, res) => {
  const sessionid = req.query.sessionid;

  const session = await Session.findById(sessionid)
    .populate("present", "name")
    .populate({
      path: "classID",
      populate: {
        path: "Students",
        select: { name: 1 },
      },
    });

  return res.status(200).json({
    data: {
      present: session.present,
      sessionStatus: session.active,
      classStrength: session.classID.Students.length,
      students: session.classID.Students,
    },
  });
};

module.exports.fetchActiveSessions = async (req, res) => {
  const classrooms = req.user.classRooms;
  let reqsessions = [];
  await Promise.all(
    classrooms.map(async (classroom) => {
      const fetchreq = async (classID) => {
        reqsessions.push(
          ...(await Session.find({
            classID,
            active: true,
            present: { $ne: req.user._id },
          }))
        );
      };
      await fetchreq(classroom.classID);
    })
  );
  return res.status(200).json({
    data: {
      userName: req.user.name,
      activeSessions: reqsessions,
    },
  });
};

module.exports.getPresentCount = async (sid) => {
  const session = await Session.findById(sid);

  if (!session) {
    return -1;
  } else {
    return session.present.length;
  }
};
