
const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

router.use(express.json());

router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required"
            });
        }

        // Verify Google's ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.sub || !payload.email) {
            return res.status(401).json({
                success: false,
                message: "Invalid Google account information"
            });
        }

        if (payload.email_verified !== true) {
            return res.status(401).json({
                success: false,
                message: "Google email is not verified"
            });
        }

        // Find the user using Google's stable account ID
        let user = await User.findOne({
            googleId: payload.sub
        });

        if (!user) {
            user = await User.create({
                googleId: payload.sub,
                name: payload.name || "Movie Booking User",
                email: payload.email,
                avatar: payload.picture || "",
                role: "customer"
            });
        }

        // Create our application's token
        const token = jwt.sign(
            {
                userId: user._id.toString()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
                issuer: "movie-booking-system",
                audience: "movie-booking-client"
            }
        );

        res.status(200).json({
            success: true,
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Google authentication error:", error.message);

        res.status(401).json({
            success: false,
            message: "Google authentication failed"
        });
    }
});

module.exports = router;
