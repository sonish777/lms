const path = require("path");
const adminViewPath = path.join(__dirname, "../views/admin/");
const Book = require("../models/book.model");
const Category = require("../models/category.model");
const BookIssue = require("../models/book-issue.model");
const User = require("../models/user.model");
const axios = require("axios");

module.exports.getLoginPage = (req, res, next) => {
  res.status(200).render(adminViewPath + "home");
};

module.exports.getAdminDashboard = async (req, res, next) => {
  const books = await Book.find();
  const categories = await Category.find();
  res.status(200).render(adminViewPath + "dashboard", {
    books: books,
    categories: categories,
  });
};

module.exports.getBooksByCategory = async (req, res, next) => {
  const { data } = await axios({
    method: "GET",
    url: `http://localhost:8000/api/v1/books/category/${req.params.slug}`,
  });
  let books = null;
  let currentCategory = null;
  if (data.data.books.length <= 0) {
    books = [];
    currentCategory = req.params.slug.toUpperCase();
  } else {
    books = data.data.books[0].books;
    currentCategory = data.data.books[0]._id[0].name.toUpperCase();
  }

  const categories = await Category.find();
  res.status(200).render(adminViewPath + "booksInCategory", {
    books,
    categories: categories,
    currentCategory,
  });
};

module.exports.getBookFormPage = async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).render(adminViewPath + "addBook", {
    categories: categories,
  });
};

module.exports.getBookIssues = async (req, res, next) => {
  let bookIssues = "";
  const categories = await Category.find();
  let newArr = [];
  let user = undefined;
  let filObj = undefined;
  let qryObj = undefined;

  if (req.query.status || req.query.email) {
    if (req.query.status) {
      qryObj = {
        $or: [],
      };
      newArr = req.query.status;
      if (!Array.isArray(req.query.status)) newArr = [req.query.status];

      newArr.forEach((el) => qryObj["$or"].push({ isActive: el }));
    }

    if (req.query.email) {
      user = await User.findOne({ email: req.query.email });
      if (!user) {
        return res.status(200).render(adminViewPath + "bookIssues", {
          bookIssues,
          categories,
          filters: newArr,
          email: req.query.email,
        });
      }
    }

    if (user && qryObj) {
      console.log("condition met", user);
      filObj = {
        $and: [{ user: user._id }, qryObj],
      };
    } else if (user) {
      filObj = {
        $and: [{ user: user._id }],
      };
    }

    bookIssues = await BookIssue.find(filObj || qryObj).sort(
      "-issueDate isActive"
    );
  } else {
    bookIssues = await BookIssue.find().sort("-issueDate isActive");
    // bookIssues = await BookIssue.find();
  }

  res.status(200).render(adminViewPath + "bookIssues", {
    bookIssues,
    categories,
    filters: newArr,
    email: req.query.email,
  });
};
