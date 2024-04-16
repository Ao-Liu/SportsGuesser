const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => { // registers a user
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

router.get('/:uid', async (req, res) => { // retrieves a user by uid
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

router.put('/update-completed/:uid', async (req, res) => { // updates # of games completed
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

router.put('/update-won/:uid', async (req, res) => { // updates # of games won
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