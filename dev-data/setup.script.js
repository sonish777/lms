const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");

const Book = require("../models/book.model");

dotenv.config({ path: "../config.env" });

const books = JSON.parse(fs.readFileSync("./books.json", "utf-8"));

const db = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db)
  .then(() => console.log("CONNECTED SUCCESS"))
  .catch((err) => console.log(err));

const importBooks = async () => {
  console.log("IMPORTING . . .");
  try {
    await Book.create(books);
    console.log("COMPLETED");
    process.exit();
  } catch (error) {
    console.log("ERROR : ", error);
    process.exit();
  }
};

importBooks();
