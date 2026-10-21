
const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },

    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
      index: true,
    },

    startsAt: {
      type: Date,
      required: true,
    },

    endsAt: {
      type: Date,
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

showSchema.index({ screen: 1, startsAt: 1 });

showSchema.pre("validate", function () {
  if (
    this.startsAt &&
    this.endsAt &&
    this.endsAt <= this.startsAt
  ) {
    this.invalidate(
      "endsAt",
      "Show end time must be after its start time"
    );
  }
});

module.exports = mongoose.model("Show", showSchema);
