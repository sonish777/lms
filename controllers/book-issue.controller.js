const BookIssue = require("../models/book-issue.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");

const AppError = require("../utils/app-error.util");
const catchAsyncError = require("../utils/catch-async-error.util");

module.exports.issueBook = catchAsyncError(async (req, res, next) => {
  const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const bookIssue = await BookIssue.findByIdAndUpdate(
    req.params.id,
    {
      returnDate,
      issueDate: new Date(Date.now()),
      isActive: "true",
    },
    { new: true }
  );

  if (!bookIssue) {
    return next(new AppError(404, "The issued detail was not found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      bookIssue,
    },
  });
});

module.exports.reserveBook = catchAsyncError(async (req, res, next) => {
  const book = await Book.findById(req.params.bookId);

  if (!book || book.quantity <= 0) {
    return next(new AppError(400, "There is no book with such id"));
  }

  const bookIssue = await BookIssue.find({
    $and: [
      { user: req.params.userId },
      { book: req.params.bookId },
      { $or: [{ isActive: "pending" }, { isActive: "true" }] },
    ],
  });

  if (bookIssue.length > 0) {
    return next(
      new AppError(400, "A book has already been issued under this credential")
    );
  }

  const newBookIssue = await BookIssue.create({
    user: req.params.userId,
    book: req.params.bookId,
    isActive: "pending",
  });

  await Book.findByIdAndUpdate(req.params.bookId, { $inc: { quantity: -1 } });

  res.status(200).json({
    status: "success",
    data: {
      bookIssue: newBookIssue,
    },
  });
});

module.exports.returnBook = catchAsyncError(async (req, res, next) => {
  const bookIssue = await BookIssue.findById(req.params.issueId);

  if (!bookIssue) {
    return next(
      new AppError(400, "No books has been issued under these credentials.")
    );
  }

  if (!bookIssue.isActive) {
    return next(new AppError(400, "Book has already been returned"));
  }

  let body = {};
  if (req.body.fine && req.body.fine > 0) {
    body = {
      isActive: "false",
      fine: req.body.fine,
    };
  } else {
    body = {
      isActive: "false",
    };
  }

  const updatedIssue = await BookIssue.findByIdAndUpdate(
    req.params.issueId,
    body,
    { new: true }
  );

  await Book.findByIdAndUpdate(req.params.bookId, { $inc: { quantity: 1 } });

  res.status(200).json({
    status: "success",
    data: {
      bookIssue: updatedIssue,
    },
  });
});

module.exports.removeReservation = catchAsyncError(async (req, res, next) => {
  const issueObj = await BookIssue.findByIdAndDelete(req.params.issueid);

  await Book.findByIdAndUpdate(issueObj.book._id, {
    $inc: { quantity: 1 },
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports.getAllIssues = catchAsyncError(async (req, res, next) => {
  const bookIssues = await BookIssue.find();
  res.status(200).json({
    status: "success",
    data: {
      bookIssues,
    },
  });
});

module.exports.getActiveIssues = catchAsyncError(async (req, res, next) => {
  const bookIssues = await BookIssue.find({ isActive: true });
  res.status(200).json({
    status: "success",
    data: {
      bookIssues,
    },
  });
});

module.exports.getIssuesByUser = catchAsyncError(async (req, res, next) => {
  const bookIssues = await BookIssue.find({ user: req.user._id }).sort(
    "-issueDate"
  );

  console.log(bookIssues);

  res.status(200).json({
    status: "success",
    data: {
      bookIssues,
    },
  });
});

module.exports.issueByAdmin = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.body.user);
  if (!user)
    return next(new AppError(404, "User with given email was not found"));

  const oldBookIssue = await BookIssue.find({
    $and: [
      { user: user._id },
      { book: req.params.bookId },
      { $or: [{ isActive: "pending" }, { isActive: "true" }] },
    ],
  });
  console.log(oldBookIssue);
  if (oldBookIssue.length > 0) {
    return next(
      new AppError(400, "A book has already been issued under this credential")
    );
  }

  req.body.book = req.params.bookId;
  req.body.user = user._id;
  req.body.returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const bookIssue = await BookIssue.create(req.body);

  await Book.findByIdAndUpdate(req.params.bookId, { $inc: { quantity: -1 } });

  res.status(200).json({
    status: "success",
    data: {
      bookIssue,
    },
  });
});
