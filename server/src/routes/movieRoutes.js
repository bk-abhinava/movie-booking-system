
const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const movie = await Movie.create(req.body);

        res.status(201).json({
            success: true,
            data: movie
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create movie"
        });
    }
});


router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: movies.length,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch movies"
        });
    }
});

module.exports = router;
