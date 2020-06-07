const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authController = require("../controllers/authentication.controller");

router
  .route("/")
  .post(userController.uploadImage, userController.createUser)
  .get(userController.getAllUser);

router.route("/login").post(authController.login);
router.route("/logout").get(authController.protect, authController.logout);
router.route("/me").get(authController.protect, authController.getMyProfile);
router.route("/login-admin").post(authController.loginAdmin);
router.route("/user-by-email").post(userController.getUserByEmail);

module.exports = router;
