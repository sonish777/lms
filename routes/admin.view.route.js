const express = require("express");
const router = express.Router();
const adminViewController = require("../controllers/admin.view.controller");
const authController = require("../controllers/authentication.controller");

router.route("/").get(adminViewController.getLoginPage);
router
  .route("/dashboard")
  .get(
    authController.protect,
    authController.hasRightTo("admin"),
    adminViewController.getAdminDashboard
  );

router
  .route("/dashboard/book-issues")
  .get(
    authController.protect,
    authController.hasRightTo("admin"),
    adminViewController.getBookIssues
  );

router
  .route("/dashboard/add-books")
  .get(
    authController.protect,
    authController.hasRightTo("admin"),
    adminViewController.getBookFormPage
  );

router
  .route("/dashboard/:slug")
  .get(
    authController.protect,
    authController.hasRightTo("admin"),
    adminViewController.getBooksByCategory
  );

module.exports = router;
