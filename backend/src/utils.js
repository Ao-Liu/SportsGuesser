const crypto = require("crypto");
const GameRoom = require("./models/gameRoom");
const Court = require('./models/court');

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
      throw new Error('No court found for the generated ID.');
    }
    console.log("court court court court: ", court);
    return {
      courtId: court.courtId,
      name: court.name,
      url: court.url,
      lat: court.lat,
      lng: court.lng
    };
}


/**
 * Generates game results.
 * e.g. [ { uid: '12345', totalDistance: 15 } ]
 */
async function calculateAndRankResults(roomId) {
  try {
    const room = await GameRoom.findById(roomId);
    if (!room) {
      return { error: 'Room not found' };
    }
    const answers = room.answers;
    const distanceSumByUid = {};
    answers.forEach(answer => {
      if (distanceSumByUid[answer.uid]) {
        distanceSumByUid[answer.uid] += answer.distance;
      } else {
        distanceSumByUid[answer.uid] = answer.distance;
      }
    });
    const rankedResults = Object.keys(distanceSumByUid).map(uid => ({
      uid: uid,
      totalDistance: distanceSumByUid[uid]
    }));
    rankedResults.sort((a, b) => a.totalDistance - b.totalDistance);
    return rankedResults;
  } catch (err) {
    console.error("Error calculating results:", err);
    return { error: 'Error calculating results' };
  }
}


module.exports = { generateUniqueCode, generateRandomCoords, calculateAndRankResults };
