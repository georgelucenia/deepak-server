const express = require("express");
const {
  addNewLocation,
  getAllLocations,
  getLocationById,
  deleteLocation,
  updateLocation,
} = require("../controllers/locationController");

const router = express.Router();

router.route("/").get(getAllLocations).post(addNewLocation);
router.route("/id").get(getLocationById);
router.route("/update").post(updateLocation);
router.route("/delete").post(deleteLocation);

module.exports = router;
