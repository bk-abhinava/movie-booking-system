const mongoose =require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title:
        {
            type:String,
            required:true,
            trim:true,
        },
          description: {
            type: String,
            required: true,
            trim: true
        },

        genre: [{
            type: String,
            trim: true
        }],

        language: {
            type: String,
            required: true,
            trim: true
        },

        durationMinutes: {
            type: Number,
            required: true,
            min: 1
        },

        releaseDate: {
            type: Date
        },

        posterUrl: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["upcoming", "now_showing", "archived"],
            default: "upcoming"
        }
    },
    {
        timestamps:true
    }
);

module.exports= mongoose.model("movie", movieSchema);