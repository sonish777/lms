const mongoose = require("mongoose");
const slugify = require("slugify");

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "Book already exists"],
  },
  author: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Author",
    },
  ],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Please specify the quantity"],
  },
  publishedAt: {
    type: Date,
  },
  details: {
    type: String,
  },
  tags: {
    type: [String],
  },
  slug: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

bookSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

bookSchema.pre("find", function (next) {
  this.populate({
    path: "author",
    select: "name",
  }).populate({
    path: "category",
    select: "name",
  });
  next();
});

bookSchema.pre("findOne", function (next) {
  this.populate({
    path: "author",
  }).populate({
    path: "category",
    select: "name slug",
  });
  next();
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
