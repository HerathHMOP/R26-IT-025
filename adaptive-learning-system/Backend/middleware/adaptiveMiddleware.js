exports.adaptiveLogic = (req, res, next) => {
  const score = req.body.score;

  if (score > 80) {
    req.body.level = "hard";
  } else if (score < 40) {
    req.body.level = "easy";
  } else {
    req.body.level = "medium";
  }

  next();
};