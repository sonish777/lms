const express = require("express");
const router = express.Router();

const authorController = require("../controllers/author.controller");

router.route("/:id").get(authorController.getBooksByAuthor);

module.exports = router;
