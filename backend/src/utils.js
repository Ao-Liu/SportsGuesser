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

module.exports = { generateUniqueCode, generateRandomCoords };
