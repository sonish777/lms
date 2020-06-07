const mongoose = require("mongoose");

const bookIssueSchema = mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now(),
  },
  duration: {
    type: Number,
    default: 7,
  },
  returnDate: {
    type: Date,
  },
  fine: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: String,
    enum: ["true", "false", "pending"],
    default: "true",
  },
});

bookIssueSchema.pre(/^find/, function (next) {
  this.populate("book").populate("user");
  next();
});

const BookIssue = mongoose.model("BookIssue", bookIssueSchema);

module.exports = BookIssue;
