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

module.exports = { generateUniqueCode };
