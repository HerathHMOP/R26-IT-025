const Progress = require("../models/Progress");

exports.saveProgress = async (req, res) => {
  try {
    const progress = new Progress(req.body);
    const saved = await progress.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const progress = await Progress.find({ userId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};