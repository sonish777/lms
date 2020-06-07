const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");

router
  .route("/")
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategory);

router.route("/:id").delete(categoryController.removeCategory);

module.exports = router;
