const express = require("express");
const db = require("./config/mongoose");
const dotenv = require("dotenv");
const passportJWT = require("./config/passport-jwt-strategy");
dotenv.config();

const app = express();
const port = process.env.PORT;
const socketPort = process.env.SOCKET_PORT;
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const socket = require("socket.io");

const { getPresentCount } = require("./controllers/api/v1/classroom/fetch");
app.use(cors());

//middleware to parse the POST requests
app.use(express.json());

app.use("/", require("./routes"));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// const io = socket.listen(httpServer);

// io.configure(function () {
//   io.set("transports", ["xhr-polling"]);
//   io.set("polling duration", 10);
// });

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    socket.join(data);
    const countPresent = async (sid) => {
      const count = await getPresentCount(sid);
      socket.emit("attendance-count", {
        count,
      });
    };

    countPresent(data);
  });

  socket.on("marked-attendance", (data) => {
    const countPresent = async (sid) => {
      const count = await getPresentCount(sid);
      socket.to(sid).emit("attendance-count", {
        count,
      });
    };
    countPresent(data.sid);
  });
});

// httpServer.listen(port, () => {
//   console.log(`socket server is running on port ${socketPort}`);
// });

httpServer.listen(port, (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`server is running on port ${port}`);
});

module.exports = io;
