const express = require('express');
const router = express.Router();
const User = require('../models/user');

/**
 * Registers a user.
 */
router.post('/', async (req, res) => {
    const user = new User({
        uid: req.body.uid,
        numGamesCompleted: req.body.numGamesCompleted || 0,
        numGamesWon: req.body.numGamesWon || 0,
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * Retrieves a user by uid.
 */
router.get('/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findOne({ uid: uid });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * Updates # of games completed.
 */
router.put('/update-completed/:uid', async (req, res) => {
    const { uid } = req.params;
    const { numGamesCompleted } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { uid: uid }, 
            { $set: { numGamesCompleted: numGamesCompleted } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * Updates # of games won.
 */
router.put('/update-won/:uid', async (req, res) => {
    const { uid } = req.params;
    const { numGamesWon } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { uid: uid }, 
            { $set: { numGamesWon: numGamesWon } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;