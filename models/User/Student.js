const mongoose = require("mongoose");

//defining a user schema
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    classRooms: [
      {
        classID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Classroom",
        },
        joinedSessions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
          },
        ],
      },
    ],
    currentChallenge: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
