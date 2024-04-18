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
  gameStarted: { type: Boolean, default: false },
  currentLevel: { type: Number, default: 0 },
  currentCoords: {
    type: { lat: Number, lng: Number },
    default: { lat: 0, lng: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameRoom", gameRoomSchema);
