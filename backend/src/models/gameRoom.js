const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameRoomSchema = new Schema({
  numOfPlayers: { type: Number, required: true, max: 10 },
  numOfLevels: { type: Number, required: true, max: 10 },
  players: [{ type: String, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameRoom", gameRoomSchema);