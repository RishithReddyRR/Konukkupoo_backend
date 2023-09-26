const ErrorHandler = require("../utils/errorhandler");
const { asyncErrorHandler } = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// require('dotenv').config({path:"backend/config/.env"})

exports.isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    next(new ErrorHandler("Please login to access the resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorHandler(`Role:${req.user.role} is not allowed to access the resource`,403))
    }
    next()
  };
};
