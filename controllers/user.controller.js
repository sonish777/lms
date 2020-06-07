const User = require("../models/user.model");
const catchAsyncError = require("../utils/catch-async-error.util");
const multerUploader = require("../utils/multer-uploader.util");

module.exports.uploadImage = multerUploader("user");

module.exports.createUser = catchAsyncError(async (req, res, next) => {
  if (req.file) {
    req.body.avatar = req.filename;
  }
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

module.exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

module.exports.getUserByEmail = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(req.body);
  res.status(200).json({
    status: "success",
    user,
  });
});
