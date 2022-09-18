const mongoose = require("mongoose");

//defining a user schema
const sessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },

    present: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);
