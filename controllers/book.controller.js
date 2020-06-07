const Book = require("../models/book.model");
const catchAsyncError = require("../utils/catch-async-error.util");
const slugify = require("slugify");
const Author = require("../models/author.model");
const AppError = require("../utils/app-error.util");
const multerUploader = require("../utils/multer-uploader.util");

module.exports.uploadImage = multerUploader("book");

module.exports.createBook = catchAsyncError(async (req, res, next) => {
  if (req.file) {
    req.body.coverImage = req.filename;
  }

  const { author } = req.body;
  req.body.author = [];
  if (author.length === 0) {
    return next(new AppError(400, "Author name is required"));
  }

  let book = await Book.create(req.body);

  const authorPromises = author.map(async (auth) => {
    return await Author.find({ slug: slugify(auth, { lower: true }) });
  });

  const authors = await Promise.all(authorPromises);

  const newAuthorsPromise = authors.map(async (auth, i) => {
    if (auth.length > 0) {
      req.body.author.push(auth[0]._id);
      return null;
    } else {
      return await Author.create({ name: author[i] });
    }
  });

  const newAuthors = await Promise.all(newAuthorsPromise);

  newAuthors.forEach((auth) => {
    if (auth) {
      req.body.author.push(auth._id);
    }
  });

  const updatedAuthorsPromises = req.body.author.map(
    async (auth) =>
      await Author.findByIdAndUpdate(auth, {
        $push: {
          books: book._id,
        },
      })
  );

  await Promise.all(updatedAuthorsPromises);

  const newBookObj = await Book.findByIdAndUpdate(
    book._id,
    { author: req.body.author },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      book: newBookObj,
    },
  });
});

module.exports.getAllBooks = catchAsyncError(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    status: "success",
    data: {
      books,
    },
  });
});

module.exports.getOneBook = catchAsyncError(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

module.exports.getBooksByCategory = catchAsyncError(async (req, res, next) => {
  const booksInCategory = await Book.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "authors",
        localField: "author",
        foreignField: "_id",
        as: "authors",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$category",
        books: {
          $push: {
            id: "$_id",
            name: "$name",
            author: "$authors",
            tags: "$tags",
            quantity: "$quantity",
            publishedAt: "$publishedAt",
            details: "$details",
            coverImage: "$coverImage",
            slug: "$slug",
          },
        },
        length: {
          $sum: 1,
        },
      },
    },
    {
      $addFields: { category: "$_id" },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        _id: 0,
        category: 1,
        books: { $slice: ["$books", 5] },
        length: 1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  res.status(200).json({
    status: "success",
    booksInCategory,
  });
});

module.exports.getBooksInCategory = catchAsyncError(async (req, res, next) => {
  const books = await Book.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "authors",
        localField: "author",
        foreignField: "_id",
        as: "authors",
      },
    },
    {
      $group: {
        _id: "$category",
        books: {
          $push: {
            id: "$_id",
            name: "$name",
            author: "$authors",
            tags: "$tags",
            quantity: "$quantity",
            publishedAt: "$publishedAt",
            details: "$details",
            coverImage: "$coverImage",
            slug: "$slug",
            category: "$category.slug",
          },
        },
      },
    },
    {
      $addFields: { category: "$_id.slug" },
    },
    {
      $unwind: "$category",
    },
    {
      $match: { category: req.params.slug },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      books,
    },
  });
});

module.exports.updateBookStock = catchAsyncError(async (req, res, next) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    {
      quantity: req.body.quantity,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      book: updatedBook,
    },
  });
});

// module.exports.createBook = catchAsyncError(async (req, res, next) => {
//   const { author } = req.body;
//   if (!author) {
//     return next(new AppError(400, "Author name is required"));
//   }
//   const authorObj = await Author.findOne({
//     slug: slugify(author, { lower: true }),
//   });

//   if (authorObj) {
//     req.body.author = authorObj._id;
//   } else {
//     delete req.body.author;
//   }

//   let book = await Book.create(req.body);

//   if (!authorObj) {
//     const newAuthor = await Author.create({ name: author, books: book._id });
//     const updatedBook = await Book.findByIdAndUpdate(
//       book._id,
//       { author: newAuthor._id },
//       { new: true }
//     );
//     return res.status(200).json({
//       status: "success",
//       data: {
//         book: updatedBook,
//       },
//     });
//   } else {
//     authorObj.books.push(book._id);
//     await authorObj.save();
//   }

//   book = await book.populate("author").execPopulate();

//   res.status(200).json({
//     status: "success",
//     data: {
//       book,
//     },
//   });
// });
