const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const categoryRoutes = require("./routes/category.route");
const bookRoutes = require("./routes/book.route");
const authorRoutes = require("./routes/author.route");
const userRoutes = require("./routes/user.route");
const bookIssueRoutes = require("./routes/book-issue.route");
const viewRoutes = require("./routes/view.route");
const adminViewRoutes = require("./routes/admin.view.route");

const globalErrorHandler = require("./utils/global-error-handler.util");

app.set("view engine", "pug");

app.use(express.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use(morgan("dev"));

// API ROUTES
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/authors", authorRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/book-issue", bookIssueRoutes);

// VIEW ROUTES

app.use("/admin", adminViewRoutes);
app.use("/", viewRoutes);

app.use(globalErrorHandler);
module.exports = app;
