const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const GameRoom = require("./models/gameRoom");
const { generateUniqueCode } = require("./utils");

const API_PORT = 3001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const dbRoute =
  "mongodb+srv://aol2:Az9999@cluster0.ufeirlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);
const gameRoutes = require("./routes/gameRoutes");
app.use("/game", gameRoutes);

let numberOfClients = 0;

io.on("connection", (socket) => {
  numberOfClients++;
  console.log(`A client connected. Number of clients: ${numberOfClients}`);

  /**
   * Handles creating a game room.
   */
  socket.on("createRoom", async (data) => {
    try {
      console.log(data);
      if (!data.numOfPlayers || !data.numOfLevels) {
        throw new Error("Required field missing");
      }
      const inviteCode = await generateUniqueCode();
      const newRoom = new GameRoom({
        numOfPlayers: Number(data.numOfPlayers),
        numOfLevels: Number(data.numOfLevels),
        inviteCode: inviteCode,
        players: [data.userId],
      });
      await newRoom.save();
      io.emit("roomCreated", {
        room: newRoom,
        inviteCode: inviteCode,
      });
    } catch (err) {
      console.error("Failed to create a new room:", err);
      socket.emit("error", "Failed to create room: " + err.message);
    }
  });

  /**
   * Handles joining a game room.
   */
  socket.on("joinRoom", async (data) => {
    try {
      const { inviteCode, userId } = data;
      const room = await GameRoom.findOne({ inviteCode: inviteCode });
      if (!room) {
        socket.emit("error", "Room not found");
        return;
      }
      if (!room.players.includes(userId)) {
        room.players.push(userId);
        await room.save();
      }
      socket.join(room._id.toString());
      socket.emit("joinedRoom", room);
    } catch (err) {
      console.error("Error joining room:", err);
      socket.emit("error", "Error joining room");
    }
  });

  socket.on("disconnect", () => {
    numberOfClients--;
    console.log(`A client disconnected. Number of clients: ${numberOfClients}`);
  });
});

server.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
