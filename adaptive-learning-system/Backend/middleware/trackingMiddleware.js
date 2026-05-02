exports.trackActivity = (req, res, next) => {
  console.log("User action tracked:", req.body);
  next();
};