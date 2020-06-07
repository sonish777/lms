const Category = require("../models/category.model");
const catchAsyncError = require("../utils/catch-async-error.util");

module.exports.createCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const newCategory = await Category.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      category: newCategory,
    },
  });
});

module.exports.getAllCategory = async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    data: {
      category: categories,
    },
  });
};

module.exports.removeCategory = async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    data: null,
  });
};
