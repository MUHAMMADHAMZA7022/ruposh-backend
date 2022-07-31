const Errorhandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.message = err.message || "Internal Serval Error";
  //5 error
  //wrong mongodb id cast error kehty
  //cast error
  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered `;
    err = new Errorhandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new Errorhandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new Errorhandler(message, 400);
  }

  res.status(err.statuscode).json({
    success: false,
    message: err.message,
  });
  //ye hum ny btya wa k ye h ag stas code ye aye simple sa
};
