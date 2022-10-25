const Location = require("../models/locationModel");
const Result = require("../models/resultModel");
// const { recentResult } = require("../utils/Common");

const lengthUpdater = (num) => {
  num = num.toString();
  let y = "";
  if (num.length == 1) {
    y = `0${num}`;
  } else {
    y = num;
  }
  return y;
};

exports.addNewLocation = async (req, res) => {
  try {
    const newLocation = await Location.create(req.body);
    const newResult = await Result.create({ location: newLocation._id });

    const currentYear = new Date().getFullYear();
    const currentMonthDate = new Date().getDate();
    const getCurrentMonth = new Date().getMonth() + 1;
    const getPreviousMonth = new Date().getMonth();
    let d = new Date();
    d.setDate(1);
    d.setHours(-1);
    const previousMonthLastDate = d.getDate();

    for (let i = currentMonthDate; i >= 1; i--) {
      await newResult.results.push({
        resultDate: `${currentYear}-${lengthUpdater(
          getCurrentMonth
        )}-${lengthUpdater(i)}`,
      });
    }

    for (let i = previousMonthLastDate; i >= 1; i--) {
      await newResult.results.push({
        resultDate: `${currentYear}-${lengthUpdater(
          getPreviousMonth
        )}-${lengthUpdater(i)}`,
      });
    }

    await newResult.save();

    res.status(201).json({
      status: "success",
      data: newLocation,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();

    res.status(201).json({
      status: "success",
      data: locations,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const locationId = req.query.locationId;
    const location = await Location.findOne({ _id: locationId });

    res.status(201).json({
      status: "success",
      data: location,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { locationId, ...body } = req.body;
    // recentResult.name = req.body.name;
    // recentResult.timeLabel = req.body.timeLabel;

    const updatedLocation = await Location.findByIdAndUpdate(locationId, body, {
      new: true,
    });

    setTimeout(() => {
      res.status(201).json({
        status: "success",
        data: updatedLocation,
      });
    }, 300);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    console.log({ body: req.body });
    const location = await Location.deleteOne({ _id: req.body.locationId });
    const result = await Result.deleteOne({ location: req.body.locationId });

    console.log({ location });
    console.log({ result });

    res.status(200).json({
      status: "success",
      data: { deleted: true },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
