const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};