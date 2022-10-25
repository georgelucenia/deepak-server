const Result = require("../models/resultModel");
const Location = require("../models/locationModel");
const { recentResult } = require("../utils/Common");
const cron = require("node-cron");
var cronJob = require("cron").CronJob;

const moment = require("moment");

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

const localDate = (date) =>
  date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString();

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate(
      "location",
      "_id name timeLabel"
    );

    res.status(200).json({
      status: "success",
      data: results,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTodayResult = async (req, res) => {
  try {
    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth() + 1;
    // const currentMonthDays = new Date().getDate();
    // console.log(
    //   `${currentYear}-${lengthUpdater(currentMonth)}-${lengthUpdater(
    //     currentMonthDays
    //   )}`
    // );

    let results = await Result.find()
      .populate("location", "_id name timeLabel")
      .limit(65);

    const newResult = [];

    const todayDate = localDate();

    const yesterdayDate = localDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1
      )
    );

    results = results.map((loc) => {
      let result = {
        _id: loc.location._id,
        name: loc.location.name,
        timeLabel: loc.location.timeLabel,
        today: 0,
        yesterday: 0,
      };
      loc = loc.results.map((v) => {
        const resultDate = localDate(v.resultDate);
        result.resultId = v._id;

        if (resultDate === todayDate) {
          result.today = v.result;
        }
        if (resultDate === yesterdayDate) {
          result.yesterday = v.result;
        }
      });

      newResult.push(result);
    });

    res.status(200).json({
      status: "success",
      data: newResult,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getCurrentMonthResult = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthDays = daysInMonth(new Date().getMonth(), currentYear);

    let allResults = await Result.find({
      resultDate: {
        $gte: new Date(`${currentYear}-${currentMonth}-01`),
        $lte: new Date(`${currentYear}-${currentMonth}-${currentMonthDays}`),
      },
    })
      .populate("location", "_id name timeLabel")
      .limit(65);

    res.status(200).json({
      status: "success",
      data: allResults,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getPreviousMonthsResult = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const previousMonth = new Date().getMonth() - 1;
    const previousMonthDays = daysInMonth(previousMonth, currentYear);

    let allResults = await Result.find({
      resultDate: {
        $gte: new Date(`${currentYear}-${previousMonth}-01`),
        $lte: new Date(`${currentYear}-${previousMonth}-${previousMonthDays}`),
      },
    })
      .populate("location", "_id name timeLabel")
      .limit(65);

    res.status(200).json({
      status: "success",
      data: allResults,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.addNewResult = async (req, res) => {
  try {
    const { locationId, resultDate, result } = req.body;

    const findResult = await Result.findOne({ location: locationId });

    if (findResult !== null) {
      findResult.results.push({
        resultDate: resultDate,
        result,
      });
      await findResult.save();

      res.status(201).json({
        status: "success",
        data: { result: findResult },
      });
    } else {
      const newResult = await Result.create({ location: locationId });
      newResult.results.push({
        resultDate: resultDate,
        result,
      });
      await newResult.save();

      res.status(201).json({
        status: "success",
        data: { result: newResult },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const { locationId, result, date } = req.body;

    let findResult = await Result.findOne({
      location: locationId,
    });
    // if (!findResult) {
    //   findResult = await Result.create({
    //     location: locationId,
    //   });
    //   await findResult.results.push({
    //     resultDate: new Date(),
    //     result: 0,
    //   });
    //   await findResult.save();
    // }
    const resultToUpdate = await findResult.results.find((i) => {
      const resultDateString = new Date(i.resultDate).toLocaleDateString();

      const compareDate = date
        ? new Date(date).toLocaleDateString()
        : new Date().toLocaleDateString();

      if (compareDate === new Date().toLocaleDateString()) {
        recentResult._id = locationId;
      }

      if (resultDateString === compareDate) {
        return i;
      } else {
        return null;
      }
    });
    if (resultToUpdate) {
      const indexOfResult = findResult.results.indexOf(resultToUpdate);
      resultToUpdate.result = result;
      findResult.results[indexOfResult] = resultToUpdate;
    }

    await findResult.save();

    // recentResult.name = updatedLocation.name;
    // recentResult.timeLabel = updatedLocation.timeLabel;

    const updatedResult = await Result.findOne({
      location: locationId,
    });

    res.status(200).json({
      status: "success",
      data: { result: { updatedResult } },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getRecentResult = async (req, res) => {
  const allResult = await Result.findOne({
    location: recentResult._id,
  }).populate("location", "_id name timeLabel");
  const recent = {
    _id: allResult?._id || "",
    name: allResult?.location.name || "",
    timeLabel: allResult?.location.timeLabel || "",
    result: "",
  };
  const result = await allResult?.results?.find(
    (v) => v.resultDate.toLocaleDateString === new Date().toLocaleDateString
  );
  recent.result = result || "";
  try {
    res.status(200).json({
      status: "success",
      data: recent,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// const autoAddResult = async () => {
//   try {
//     var utc = Math.floor(+new Date() / 1000);

//     // var year = moment.unix(utc).tz("Asia/Kolkata").format("YYYY");
//     // var month = moment.unix(utc).tz("Asia/Kolkata").format("MM");
//     // var date = moment.unix(utc).tz("Asia/Kolkata").format("DD");

//     var day = new Date();
//     var nextDay = new Date(day);
//     nextDay.setDate(day.getDate() + 1);
//     var year = nextDay.getFullYear();
//     var month = nextDay.getMonth();
//     var date = nextDay.getDate();
//     const newDate = `${year}-${lengthUpdater(month)}-${lengthUpdater(date)}`;

//     // var fullDate = moment
//     //   .unix(utc)
//     //   .tz("Asia/Kolkata")
//     //   .format("YYYY-MM-DD h:mm:ss a");
//     // cron.
//     var cronJ = new cronJob(
//       "0 2 0 * * *",
//       async () => {
//         console.log("Adding results automatically  : ", newDate);
//         const locations = await Location.find();
//         const body = {
//           resultDate: newDate,
//           result: "",
//         };

//         console.log("Adding Result : ", body);
//         const addresults = async () => {
//           locations.map(async ({ _id }) => {
//             const findResult = await Result.findOne({
//               location: _id,
//             });

//             if (findResult !== null) {
//               await findResult.results.unshift(body);
//               await findResult.save();
//             } else {
//               const newResult = await Result.create({
//                 location: _id,
//               });
//               await newResult.results.unshift(body);
//               await newResult.save();
//             }
//           });
//         };
//         await addresults();
//       },
//       undefined,
//       true,
//       "Asia/Kolkata"
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.addBlankResults = async (req, res) => {
  try {
    const { date } = req.body;
    console.log("Adding Blank Results  : ", date);
    const locations = await Location.find();
    const body = {
      resultDate: date,
      result: "",
    };

    console.log("Blank Result : ", body);
    const addresults = async () => {
      locations.map(async ({ _id }) => {
        const findResult = await Result.findOne({
          location: _id,
        });

        if (findResult !== null) {
          await findResult.results.unshift(body);
          await findResult.save();
        } else {
          const newResult = await Result.create({
            location: _id,
          });
          await newResult.results.unshift(body);
          await newResult.save();
        }
      });
    };
    await addresults();
    res.status(200).json({
      status: "success",
      message: "Results added",
    });
  } catch (err) {
    console.log(err);
  }
};

// autoAddResult();
