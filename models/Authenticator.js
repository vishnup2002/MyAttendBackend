const mongoose = require("mongoose");

const authenticatorSchema = new mongoose.Schema({
  credentialID: {
    // type: String,
    type: mongoose.Schema.Types.Buffer,
  },
  credentialPublicKey: {
    // type: String,
    type: mongoose.Schema.Types.Buffer,
  },
  counter: {
    type: Number,
  },
  transports: {
    type: String,
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("Authenticator", authenticatorSchema);
