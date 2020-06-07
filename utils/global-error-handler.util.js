const sendErrorDev = (error, res) => {
  console.log(error);
  res.status(error.statusCode).json({
    status: "fail",
    message: error.message,
    error: error.stack,
  });
};

module.exports = (err, req, res, next) => {
  console.log("--------------INSIDE ERROR HANDLER-------------");
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
};
