const Errorhandler = require("../utils/errorhandler");
const catchasyncerror = require("../middleware/asyncerror.js");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
module.exports = Authenticate = catchasyncerror(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    return next(new Errorhandler("Login to access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});
//role ha  ye admin ha to ye kro
exports = authorizerole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhandler(
          `Role:${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
