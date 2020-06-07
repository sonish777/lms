const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const AppError = require("../utils/app-error.util");
const catchAsyncError = require("../utils/catch-async-error.util");

module.exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, "Please provide email and password"));
  }

  const user = await User.findOne({
    $and: [{ email: email }, { role: "user" }],
  }).select("+password");
  if (!user) {
    return next(new AppError(401, "Invalid email or password"));
  }

  if ((await user.isPasswordCorrect(password)) !== true) {
    return next(new AppError(401, "Invalid email or password"));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: Date.now() + 24 * 60 * 60 * 1000,
  });

  if (!token) {
    return next(
      new AppError(500, "Token could not be created. Please try again")
    );
  }

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
});

module.exports.protect = catchAsyncError(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token === "") {
    return next(new AppError(401, "You are not logged in"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(404, "The user belonging to this token no longer exists")
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

module.exports.isLoggedIn = catchAsyncError(async (req, res, next) => {
  if (!req.cookies.jwt) {
    return next();
  }

  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next();
  }
  res.locals.user = currentUser;
  next();
});

module.exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("jwt", "LoggedOut", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports.hasRightTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Permission denied"));
    }

    next();
  };
};

module.exports.getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError(401, "You are not logged in! Please login first"));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

module.exports.loginAdmin = catchAsyncError(async (req, res, next) => {
  const admin = await User.findOne({
    $and: [{ email: req.body.email }, { role: "admin" }],
  }).select("+password");

  if (!admin) {
    return next(new AppError(404, "Invalid credientials"));
  }

  if (!(await admin.isPasswordCorrect(req.body.password))) {
    return next(new AppError(404, "Invalid Credentials"));
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: Date.now() + 24 * 60 * 60 * 1000,
  });

  if (!token) {
    return next(
      new AppError(500, "Token could not be created. Please try again")
    );
  }

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
});
