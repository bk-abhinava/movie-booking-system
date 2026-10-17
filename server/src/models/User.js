const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        avatar: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);