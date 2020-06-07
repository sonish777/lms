const express = require("express");
const router = express.Router();

const viewController = require("../controllers/view.controller");
const authController = require("../controllers/authentication.controller");

router.use(authController.isLoggedIn);

router.route("/").get(viewController.getHomePage);
router.route("/books").get(viewController.getBooksPage);
router.route("/books/category/:slug").get(viewController.getBooksPage);
router.route("/login").get(viewController.getLoginPage);
router.route("/register").get(viewController.getRegisterPage);
router
  .route("/mybooks")
  .get(
    authController.protect,
    authController.hasRightTo("user"),
    viewController.getMyBooks
  );

router.route("/book/:slug").get(viewController.getBookDetailPage);

module.exports = router;
