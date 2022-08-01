const express = require("express");
const db = require("./config/mongoose");

const app = express();
const port = 8000;

//middleware to parse the POST requests
app.use(express.json());

app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log(console.error);
  }

  console.log(`server is running on port ${port}`);
});
