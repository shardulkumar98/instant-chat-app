const express = require("express");
const { createServer } = require("http"); // Change 'node:http' to 'http'
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const uuid = require("uuid");

// express setup
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("../public"));

app.get("/", (req, res) => {
  res.status(200).sendFile(".public/index.html");
});

// initialize express server with the node server
const httpServer = createServer(app);

// setup sockets with http server
const io = new Server(httpServer, {
  // options
  //   addTrailingSlash: false, // low-level engine options
  //   allowEIO3: true, // enable compatibility with Socket.IO v2 clients
  //   cookie: {
  //     name: "my-cookie",
  //     httpOnly: true,
  //     sameSite: "strict",
  //     maxAge: 86400,
  //   },
});

// Set up generateId function for Socket.IO server
io.engine.generateId = (req) => uuid.v4();

// const users = {};

io.on("connection", (socket) => {
  // console.log("socket.id", socket.id);
  //   socket.on("user-joined", (name) => {
  //     users[socket.id] = name;
  //     socket.broadcast.emit()
  //   });

  socket.on("user-msg", (message) => {
    socket.broadcast.emit("receive", message);
  });
});

httpServer.listen(3001, () => console.log("server is running..."));
