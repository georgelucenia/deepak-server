const express = require("express");
const {
  addNewResult,
  updateResult,
  getAllResults,
  getTodayResult,
  getCurrentMonthResult,
  getPreviousMonthsResult,
  getRecentResult,
  addBlankResults,
} = require("../controllers/resultController");

const router = express.Router();

router.route("/").get(getAllResults).post(addNewResult);
router.route("/update").post(updateResult);
router.route("/getTodayResult").get(getTodayResult);
router.route("/getCurrentMonthResult").get(getCurrentMonthResult);
router.route("/getPreviousMonthResult").get(getPreviousMonthsResult);
router.route("/getRecentResult").get(getRecentResult);
router.route("/addBlankResults").post(addBlankResults);

module.exports = router;
