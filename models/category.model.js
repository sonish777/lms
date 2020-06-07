const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "Name already in use"],
  },
  slug: {
    type: String,
  },
});

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });

  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
