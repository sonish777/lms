const express = require("express");
const router = express.Router();

const bookIssueController = require("../controllers/book-issue.controller");
const authController = require("../controllers/authentication.controller");

router
  .route("/")
  .get(
    authController.protect,
    authController.hasRightTo("admin"),
    bookIssueController.getAllIssues
  );

router
  .route("/active")
  .get(
    authController.protect,
    authController.hasRightTo("admin"),
    bookIssueController.getActiveIssues
  );

router
  .route("/:issueId/return/:bookId")
  .patch(
    authController.protect,
    authController.hasRightTo("admin"),
    bookIssueController.returnBook
  );

router
  .route("/book/:bookId/user/:userId")
  .post(bookIssueController.reserveBook);

router
  .route("/mybooks")
  .get(
    authController.protect,
    authController.hasRightTo("user"),
    bookIssueController.getIssuesByUser
  );

router
  .route("/issue/admin/:bookId")
  .post(
    authController.protect,
    authController.hasRightTo("admin"),
    bookIssueController.issueByAdmin
  );

router
  .route("/issue/:id")
  .patch(
    authController.protect,
    authController.hasRightTo("admin"),
    bookIssueController.issueBook
  );

router
  .route("/:issueid")
  .delete(authController.protect, bookIssueController.removeReservation);

module.exports = router;
