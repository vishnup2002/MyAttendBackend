const mongoose = require("mongoose");

//defining a user schema
const classRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Classroom",
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    Students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Classroom", classRoomSchema);
