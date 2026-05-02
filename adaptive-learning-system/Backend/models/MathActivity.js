const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  grade: Number,
  topic: String,
  title: String,
  type: String,
  difficulty: String,
});

module.exports = mongoose.model("MathActivity", activitySchema);