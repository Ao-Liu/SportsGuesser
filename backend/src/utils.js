const crypto = require("crypto");
const GameRoom = require("./models/gameRoom");

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
 * Generates a random coordinate.
 * Tentative.
 */
function generateRandomCoords() {
  return {
      lat: (Math.random() * 180 - 90).toFixed(2),
      lng: (Math.random() * 360 - 180).toFixed(2)
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
