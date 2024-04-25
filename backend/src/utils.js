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
 * Returns a specific coordinate based on the input index.
 * @param {number} index - The index of the coordinate to return.
 */
function generateRandomCoords(index) {
  const coords = [
    { lat: -37.819967, lng: 144.983449 }, // Melbourne Cricket Ground, Melbourne, Australia, https://commons.wikimedia.org/wiki/File:Melbourne_Cricket_Ground_2017.jpg
    { lat: 39.99285, lng: 116.3964 }, // Beijing National Stadium (Bird's Nest), Beijing, China, https://commons.wikimedia.org/wiki/File:Beijing_national_stadium.jpg
    { lat: 48.2188, lng: 11.624707 }, // Allianz Arena, Munich, Germany, https://commons.wikimedia.org/wiki/File:Allianz_Arena_Panorama.jpg
    { lat: 42.3467, lng: -71.0972 }, // Fenway Park, Boston, Massachusetts, USA, https://commons.wikimedia.org/wiki/File:Fenway_from_Legend%27s_Box.jpg
    { lat: 51.556021, lng: -0.279519 }, // Wembley Stadium, London, England, https://commons.wikimedia.org/wiki/File:Wembley_Stadium_interior.jpg
    { lat: 51.4816, lng: -0.191034 }, // Stamford Bridge, London, England, https://commons.wikimedia.org/wiki/File:Stamford_Bridge_Clear_Skies.JPG
    { lat: -22.9122, lng: -43.2302 }, // Maracanã Stadium, Rio de Janeiro, Brazil, https://commons.wikimedia.org/wiki/File:Maracana%C3%A3.jpg
    { lat: -26.2348, lng: 27.9823 }, // Soccer City (FNB Stadium), Johannesburg, South Africa, https://commons.wikimedia.org/wiki/File:FNB_Stadium.jpg
    { lat: 41.3809, lng: 2.1228 }, // Camp Nou, Barcelona, Spain, https://commons.wikimedia.org/wiki/File:Camp_Nou_panoramio.jpg
    { lat: 40.8296, lng: -73.9262 }, // Yankee Stadium, New York, USA, https://commons.wikimedia.org/wiki/File:Yankee_Stadium_2015.jpg
    { lat: 40.4466, lng: -80.0157 } // Acrisure Stadium, Pittsburgh, USA, https://9b16f79ca967fd0708d1-2713572fef44aa49ec323e813b06d2d9.ssl.cf2.rackcdn.com/1140x_a10-7_cTC/20220711MTHeinzFieldAerials01-1657562902.jpg
  ];
  
  
  // Ensure the index is within the bounds of the coords array
  if (index < 1 || index > coords.length) {
    throw new Error("Index out of bounds");
  }

  // Return the coordinate at the given index, adjusting for zero-based index
  return coords[index - 1];
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
