const crypto = require("crypto");
const GameRoom = require("./models/gameRoom");
const User = require("./models/user");
const Court = require("./models/court");
const mongoose = require("mongoose");

/**
 * Generates a 4-digit invite code.
 */
async function generateUniqueCode() {
  while (true) {
    const code = crypto.randomInt(1000, 9999).toString();
    const existingRoom = await GameRoom.findOne({ inviteCode: code }).exec();
    if (!existingRoom) {
      return code;
    }
  }
}

/**
 * Returns a specific coordinate of the selected court.
 */
async function generateRandomCoords() {
  const randomCourtID = crypto.randomInt(1, 12).toString();
  const court = await Court.findOne({ courtId: randomCourtID }).exec();
  if (!court) {
    throw new Error("No court found for the generated ID.");
  }
  console.log("court court court court: ", court);
  return {
    courtId: court.courtId,
    name: court.name,
    url: court.url,
    lat: court.lat,
    lng: court.lng,
  };
}

/**
 * Generates game results.
 * e.g. [ { displayName: 'Ao Liu', totalDistance: 6910.2967512598225 } ]
 */

async function calculateAndRankResults(roomId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const room = await GameRoom.findById(roomId).session(session);
    if (!room) {
      await session.abortTransaction();
      session.endSession();
      return { error: "Room not found" };
    }
    if (room.winnerCalculated) {
      await session.abortTransaction();
      session.endSession();
      return room.rankings; 
    }
    const distanceSumByUid = {};
    room.answers.forEach((answer) => {
      if (distanceSumByUid[answer.uid]) {
        distanceSumByUid[answer.uid] += answer.distance;
      } else {
        distanceSumByUid[answer.uid] = answer.distance;
      }
    });
    const uids = Object.keys(distanceSumByUid);
    const userInfos = await User.find({ 'uid': { $in: uids } }).session(session);
    const uidToDisplayName = userInfos.reduce((acc, user) => ({
      ...acc,
      [user.uid]: `${user.displayName} (${user.email})` || "Unknown",
    }), {});
    const rankedResults = uids.map(uid => ({
      displayName: uidToDisplayName[uid],
      totalDistance: distanceSumByUid[uid]
    }));
    rankedResults.sort((a, b) => a.totalDistance - b.totalDistance);
    room.rankings = rankedResults.map(result => ({
      displayName: result.displayName,
      totalDistance: result.totalDistance
    }));
    room.winnerCalculated = true;
    if (rankedResults.length > 0) {
      // update numGamesWon for the winner
      const winnerUsername = rankedResults[0].displayName;
      await User.updateOne({ displayName: winnerUsername }, { $inc: { numGamesWon: 1 } }).session(session);;
    }
    // update numGamesCompleted for everyone
    for (const playerUid of room.players) {
      await User.updateOne({ uid: playerUid }, { $inc: { numGamesCompleted: 1 } }).session(session);
    }
    await room.save({ session });
    await session.commitTransaction();
    session.endSession();
    return rankedResults;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error calculating results:", err);
    return { error: "Error calculating results" };
  }
}

module.exports = {
  generateUniqueCode,
  generateRandomCoords,
  calculateAndRankResults,
};
