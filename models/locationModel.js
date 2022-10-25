const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    timeLabel: {
      type: String,
      required: [true, "time label is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
