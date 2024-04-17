const express = require('express');
const router = express.Router();
const GameRoom = require('../models/gameRoom');
const { generateUniqueCode } = require('../utils');

/**
 * The traditional HTTP way of handling room creation.
 * Not needed when using websocket.
 */
router.post('/create', async (req, res) => {
    try {
        const { numOfPlayers, numOfLevels, players } = req.body;
        const inviteCode = await generateUniqueCode(); 
        const newGameRoom = new GameRoom({
            numOfPlayers,
            inviteCode,
            numOfLevels,
            players
        });
        await newGameRoom.save();
        res.status(201).json(newGameRoom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;