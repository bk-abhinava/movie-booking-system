
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                issuer: "movie-booking-system",
                audience: "movie-booking-client"
            }
        );

        if (!mongoose.isValidObjectId(decoded.userId)) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
};

module.exports = { protect };
