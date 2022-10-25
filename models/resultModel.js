const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const resultSchema = new mongoose.Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: [true, "locationId is required"],
  },
  results: [
    {
      result: {
        type: String,
        default: "",
      },
      resultDate: {
        type: Date,
        unique: true,
        default: new Date(),
      },
    },
  ],
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
