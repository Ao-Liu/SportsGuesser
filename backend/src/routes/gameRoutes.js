const express = require('express');
const router = express.Router();
const GameRoom = require('../models/gameRoom');

router.post('/create', async (req, res) => {
    try {
        const { numOfPlayers, numOfLevels, players } = req.body;
        const newGameRoom = new GameRoom({
            numOfPlayers,
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