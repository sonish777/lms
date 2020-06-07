const axios = require("axios");
const BookIssue = require("../models/book-issue.model");
const path = require("path");

const userViewPath = path.join(__dirname, "../views/user/");

module.exports.getHomePage = async (req, res, next) => {
  try {
    const result = await axios({
      method: "GET",
      url: "http://localhost:8000/api/v1/books/sorted-by-category",
    });

    res.status(200).render(userViewPath + "home", {
      title: "Bookshelf | Home",
      booksByCategory: result.data.booksInCategory,
    });
  } catch (error) {
    res.status(404).end("SOMETHING WENT WRONG :(");
  }
};

module.exports.getBooksPage = async (req, res, next) => {
  try {
    const url = req.params.slug
      ? `http://localhost:8000/api/v1/books/category/${req.params.slug}`
      : `http://localhost:8000/api/v1/books`;
    const bookResults = await axios({
      method: "GET",
      url,
    });

    const categoryResults = await axios({
      method: "GET",
      url: "http://localhost:8000/api/v1/categories",
    });

    let books = null;

    if (req.params.slug && bookResults.data.data.books.length === 0) {
      books = null;
    } else {
      books = bookResults.data.data.books[0].books;
    }

    console.log(books);

    res.status(200).render(userViewPath + "books", {
      title: "Bookshelf | Books",
      books: req.params.slug ? books : bookResults.data.data.books,
      categories: categoryResults.data.data.category,
      currentCategory: req.params.slug,
    });
  } catch (error) {
    res.status(404).end("SOMETHING WENT WRONG :(");
  }
};

module.exports.getLoginPage = (req, res, next) => {
  if (res.locals.user) {
    return res.status(200).redirect("back");
  }

  res.status(200).render(userViewPath + "login", {
    title: "Bookshelf | Login",
  });
};

module.exports.getRegisterPage = (req, res, next) => {
  if (res.locals.user) {
    return res.status(200).redirect("back");
  }

  res.status(200).render(userViewPath + "register", {
    title: "Bookshelf | Register",
  });
};

module.exports.getMyBooks = async (req, res, next) => {
  try {
    const bookIssues = await BookIssue.find({ user: req.user._id }).sort(
      "-issueDate"
    );

    res.status(200).render(userViewPath + "mybooks", {
      title: "Bookshelf | My Books",
      books: bookIssues,
    });
  } catch (error) {
    res.status(404).end("SOMETHING WENT WRONG :(");
  }
};

module.exports.getBookDetailPage = async (req, res, next) => {
  try {
    const bookResults = await axios({
      method: "GET",
      url: `http://localhost:8000/api/v1/books/${req.params.slug}`,
    });

    const categoryResults = await axios({
      method: "GET",
      url: "http://localhost:8000/api/v1/categories",
    });

    console.log(bookResults.data.data.book.category.slug);

    if (bookResults.data.status === "success") {
      res.status(200).render(userViewPath + "book", {
        title: "Bookshelf | Book Detail",
        categories: categoryResults.data.data.category,
        book: bookResults.data.data.book,
        currentCategory: bookResults.data.data.book.category.slug,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end("Book not found with that name.");
  }
};
