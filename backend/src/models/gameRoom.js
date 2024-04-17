const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * DB schema for a game room object.
 */
const gameRoomSchema = new Schema({
  numOfPlayers: { type: Number, required: true, max: 10 },
  numOfLevels: { type: Number, required: true, max: 10 },
  inviteCode: { type: String, unique: true, required: true },
  players: [{ type: String, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameRoom", gameRoomSchema);