const catchAsyncError = require("../utils/catch-async-error.util");
const Author = require("../models/author.model");

module.exports.getBooksByAuthor = catchAsyncError(async (req, res, next) => {
  const author = await Author.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      author,
    },
  });
});
