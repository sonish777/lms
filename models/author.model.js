const mongoose = require("mongoose");
const slugify = require("slugify");

const authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  slug: {
    type: String,
  },
  books: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
    },
  ],
});

authorSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

authorSchema.pre("findOne", function (next) {
  this.populate({
    path: "books",
  });
  next();
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
