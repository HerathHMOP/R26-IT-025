const express = require("express");
const router = express.Router();
const {
  saveProgress,
  getProgress,
} = require("../controllers/progressController");
const { adaptiveLogic } = require("../middleware/adaptiveMiddleware");
const { trackActivity } = require("../middleware/trackingMiddleware");

router.post("/", trackActivity, adaptiveLogic, saveProgress);
router.get("/:userId", getProgress);

module.exports = router;