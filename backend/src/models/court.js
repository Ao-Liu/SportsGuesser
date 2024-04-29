const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * DB schema for a stadium object.
 */
const CourtSchema = new Schema({
  courtId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

module.exports = mongoose.model("Court", CourtSchema);
