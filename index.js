const express = require("express");
const db = require("./config/mongoose");
const dotenv = require("dotenv");
const passportJWT = require("./config/passport-jwt-strategy");
dotenv.config();

const app = express();
const port = process.env.PORT;

//middleware to parse the POST requests
app.use(express.json());

app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`server is running on port ${port}`);
});
