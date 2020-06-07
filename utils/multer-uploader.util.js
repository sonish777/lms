const multer = require("multer");

const AppError = require("./app-error.util");

module.exports = (identifier) => {
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/imgs/${identifier}s`);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      req.filename = `${identifier}-${
        file.originalname.split(".")[0]
      }-${Date.now()}.${ext}`;
      cb(null, req.filename);
    },
  });

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError(400, "Please provide a valid email"), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload.single("image");
};
