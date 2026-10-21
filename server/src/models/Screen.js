
const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema(
  {
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    screenType: {
      type: String,
      enum: ["standard", "imax", "4dx", "dolby"],
      default: "standard",
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

screenSchema.index(
  { cinema: 1, name: 1 },
  { unique: true }
);

module.exports = mongoose.model("Screen", screenSchema);
