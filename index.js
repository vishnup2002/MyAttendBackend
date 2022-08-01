const express = require("express");
const app = express();
const port = 8000;

app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log(console.error);
  }

  console.log(`server is running on port ${port}`);
});
