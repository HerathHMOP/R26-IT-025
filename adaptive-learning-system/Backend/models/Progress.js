const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: String,
  activityId: String,
  score: Number,
  attempts: Number,
  level: String,
});

module.exports = mongoose.model("Progress", progressSchema);