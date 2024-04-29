const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * DB schema for a user object.
 */
const UserSchema = new Schema({
  uid: { type: String, required: true, unique: true }, // firebase generates this ID
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  numGamesCompleted: { type: Number, default: 0 },
  numGamesWon: { type: Number, default: 0 },
  visitedCourts: [{ courtId: String }],
});

module.exports = mongoose.model("User", UserSchema);
