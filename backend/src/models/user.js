const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    uid: { type: String, required: true, unique: true }, // firebase generates this ID
    numGamesCompleted: { type: Number, default: 0 },
    numGamesWon: { type: Number, default: 0 }   
});

module.exports = mongoose.model('User', UserSchema);