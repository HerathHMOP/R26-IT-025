const express = require("express");
const router = express.Router();
const {
  getActivities,
  getActivitiesByGrade,
} = require("../controllers/activityController");

router.get("/", getActivities);
router.get("/:grade", getActivitiesByGrade);

module.exports = router;