const MathActivity = require("../models/MathActivity");

exports.getActivities = async (req, res) => {
  try {
    const activities = await MathActivity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivitiesByGrade = async (req, res) => {
  try {
    const grade = req.params.grade;
    const activities = await MathActivity.find({ grade });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};