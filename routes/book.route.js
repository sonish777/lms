const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");
const authController = require("../controllers/authentication.controller");

router
  .route("/")
  .post(
    authController.protect,
    authController.hasRightTo("admin"),
    bookController.uploadImage,
    bookController.createBook
  )
  .get(bookController.getAllBooks);

router.route("/sorted-by-category").get(bookController.getBooksByCategory);

router.route("/category/:slug").get(bookController.getBooksInCategory);

router
  .route("/:id")
  .get(bookController.getOneBook)
  .patch(bookController.updateBookStock);

module.exports = router;
