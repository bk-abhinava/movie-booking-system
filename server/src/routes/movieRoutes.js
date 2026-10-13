const mongoose = require("mongoose");
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
        const {
            search,
            genre,
            status,
            page = "1",
            limit = "10"
        } = req.query;

        const pageNumber = Number(page);
        const pageSize = Number(limit);

        if (
            !Number.isInteger(pageNumber) ||
            !Number.isInteger(pageSize) ||
            pageNumber < 1 ||
            pageSize < 1 ||
            pageSize > 50
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be positive and limit must be between 1 and 50"
            });
        }

        const filter = {};

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (genre) {
            filter.genre = {
                $in: [genre]
            };
        }

        if (status) {
            const allowedStatuses = [
                "upcoming",
                "now_showing",
                "archived"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid movie status"
                });
            }

            filter.status = status;
        }

        const skip = (pageNumber - 1) * pageSize;

        const [movies, total] = await Promise.all([
            Movie.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize),

            Movie.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: movies,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.error("Fetch movies error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch movies"
        });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie ID"
            });
        }

        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        res.status(200).json({
            success: true,
            data: movie
        });
    } catch (error) {
        console.error("Get movie error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch movie"
        });
    }
});



module.exports = router;
