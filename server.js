process.on("uncaughtException", (err) => {
  console.log("------------UNCAUGHT EXCEPTION------------");
  console.log("\nERROR : ", err);
  process.exit();
});

const app = require("./app");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

if (process.env.NODE_ENV === "development") {
  console.log("MORGAN ENABLED");
  app.use(morgan("dev"));
}

const db = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB CONNECTED SUCCESSFULLY"))
  .catch((err) => console.log("DB CONN ERR : ", err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("------------UNHANDLED REJECTION------------");
  console.log("\nERROR : ", err);
  process.exit();
});
