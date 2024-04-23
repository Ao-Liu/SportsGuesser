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

router.post('/create', async (req, res) => {
    // console.log("in users/create");
    let user = await User.findOne({ uid: req.body.uid });
    if (!user) {
        // console.log("User does not exist yet");
        user = new User({
            uid: req.body.uid,
            displayName: req.body.displayName,
            email: req.body.email,
            photoURL: req.body.photoURL,
            numGamesCompleted: req.body.numGamesCompleted || 0,
            numGamesWon: req.body.numGamesWon || 0,
            visitedCourNameUrl: [
                { 
                    CourtdisplayName: 'Staples Center Lakers', 
                    CourtPhotoURL: 'https://c8.alamy.com/comp/AR6H8X/nba-la-lakers-staple-center-los-angeles-california-usa-AR6H8X.jpg' 
                },
                { 
                    CourtdisplayName: 'Pittsburgh Penguins Hockey', 
                    CourtPhotoURL: 'https://www.discovertheburgh.com/wp-content/uploads/2018/04/20180411_200128-600px.jpg' 
                },
            ],
        });

        try {
            // console.log("waiting user being saved.")
            const newUser = await user.save();
            // console.log("New User is saved: ", newUser);
            res.status(201).json(newUser);
        } catch (err) {
            console.error("Error saving user:", err);
            res.status(400).json({ message: err.message });
        }
    } else {
        // console.log("User already exists.");
        // console.log("Existed User Info: ", user);
        res.status(201).json({});
    }   
});

/**
 * Retrieves a user by uid.
 */
router.get('/:uid', async (req, res) => {
    console.log("backend backend looking for Uid: ", req.params.uid)
    const { uid } = req.params;

    ////////// Temporary dummy data ////////////
    // const dummyUser = {
    //     uid: 1,
    //     displayName: "Scotty",
    //     email: "scotty@gmail",
    //     photoURL: "https://www.cmu.edu/brand/brand-guidelines/images/scottycrop2-600x600.png",
    //     numGamesCompleted: 10,
    //     numGamesWon: 2,
    //     conqueredCourNameUrl: [
    //         { name: 'Staples Center Lakers', url: 'https://c8.alamy.com/comp/AR6H8X/nba-la-lakers-staple-center-los-angeles-california-usa-AR6H8X.jpg' },
    //         { name: 'Pittsburgh Penguins Hockey', url: 'https://www.discovertheburgh.com/wp-content/uploads/2018/04/20180411_200128-600px.jpg' },
    //     ],
    // };
    ////////// Temporary dummy data ////////////

    try {
        // console.log("looking for uid: ", uid)
        const user = await User.findOne({ uid: uid });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
        // res.json(dummyUser);
    } catch (err) {
        console.log("error");
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

