const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const GameRoom = require("./models/gameRoom");
const { generateUniqueCode, generateRandomCoords, calculateAndRankResults } = require("./utils");
const User = require('./models/user');

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
      if (!data.numOfLevels) {
        throw new Error("Required field missing");
      }
      const inviteCode = await generateUniqueCode();
      const newRoom = new GameRoom({
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
      if (room.gameStarted) { // users should not join a game room if it has started.
        socket.emit("gameStarted");
        return;
      }
      if (!room.players.includes(userId)) {
        room.players.push(userId);
        await room.save();
      }
      socket.join(data.roomId);
      socket.emit("joinedRoom", room);
    } catch (err) {
      console.error("Error joining room:", err);
      socket.emit("error", "Error joining room");
    }
  });

  /**
   * Handles fetching room details.
   */
  socket.on("getRoomDetails", async (roomId) => {
    try {
      const room = await GameRoom.findById(roomId);
      if (!room) {
        socket.emit("roomDetailsError", "Room not found");
        return;
      }
      socket.emit("roomDetails", room);
    } catch (err) {
      console.error("Error fetching room details:", err);
      socket.emit("roomDetailsError", "Failed to fetch room details");
    }
  });

  /**
   * Starts a game.
   */
  socket.on("startGame", async (data) => {
    const room = await GameRoom.findById(data.roomId);
    if (!room) {
      socket.emit("error", "Room not found");
      return;
    }
    socket.join(data.roomId);
    room.gameStarted = true;
    room.currentCoords = await generateRandomCoords();
    await room.save();
    io.to(data.roomId).emit("gameStarted", {
      level: room.currentLevel,
      coords: room.currentCoords,
    });
  });

  /**
   * Fetches current level info.
   */
  socket.on("getLevelInfo", async ({ roomId }) => {
    try {
      const room = await GameRoom.findById(roomId);
      if (!room) {
        console.log("Room not found.");
        socket.emit("levelInfoError", "Room not found");
        return;
      }
      socket.join(roomId);
      room.currentCoords = await generateRandomCoords(); // TODO: change this
      await room.save();
      io.to(roomId).emit("levelInfoFetched", {
        level: room.currentLevel,
        coords: room.currentCoords,
      });
    } catch (err) {
      console.error("Error fetching level information:", err);
      socket.emit("levelInfoError", "Error fetching level information");
    }
  });

  /**
   * Goes to the next level.
   */
  socket.on("nextLevel", async ({ roomId, currentLevel }) => {
    try {
      const room = await GameRoom.findById(roomId);
      if (room) {
        if (room.numOfLevels == currentLevel) {
          socket.join(roomId);
          socket.emit("gameEnded");
        } else {
          const nextLevel = currentLevel + 1;
          room.currentLevel = nextLevel;
          await room.save();
          socket.join(roomId);
          room.currentCoords = await generateRandomCoords(); // TODO: change this
          socket.emit("newLevelInfo", {
            level: room.currentLevel,
            coords: room.currentCoords,
          });
        }
      } else {
        socket.emit("error", "Room not found");
      }
    } catch (err) {
      console.error("Error updating level:", err);
      socket.emit("error", "Failed to update level");
    }
  });

  /**
   * Records answer for each step.
   */
  socket.on("submitGuess", async ({ roomId, uid, level, distance }) => {
    console.log(
      `Received guess from player ${uid} for level ${level}: ${distance}`
    );
    try {
      const room = await GameRoom.findById(roomId);
      if (!room) {
        console.log("Room not found.");
        socket.emit("error", "Room not found");
        return;
      }
      room.answers.push({
        uid,
        level,
        distance,
      });
      await room.save();
      const expectedAnswers = room.players.length * room.currentLevel;
      const receivedAnswers = room.answers.length;
      console.log(
        `Expect ${expectedAnswers} answers to continue to the next level, got ${receivedAnswers} answers`
      );
      if (receivedAnswers >= expectedAnswers) {
        socket.join(roomId);
        io.to(roomId).emit("levelCompleted", {
          level,
          message: "All answers received for level " + level,
        });
      }
    } catch (err) {
      console.error("Failed to record guess:", err);
      socket.emit("error", "Failed to record your guess");
    }
  });

  /**
   * Generates results after a game ends.
   */
  socket.on("getResults", async ({ roomId }) => {
    try {
      let results = await calculateAndRankResults(roomId);
      socket.join(roomId);
      io.to(roomId).emit("results", results);
    } catch (err) {
      console.error("Failed to get results:", err);
      socket.emit("error", "Failed to fetch results");
    }
  });

  /**
   * Fethches username.
   */
  socket.on("getUsername", async ({ roomId, uid }) => {
    try {
      const user = await User.findOne({ uid: uid });
      socket.join(roomId);
      io.to(roomId).emit("username", user.displayName);
    } catch (err) {
      console.error("Failed to get user info:", err);
      socket.emit("error", "Failed to fetch user info");
    }
  });

  socket.on("disconnect", () => {
    numberOfClients--;
    console.log(`A client disconnected. Number of clients: ${numberOfClients}`);
  });
});

server.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));