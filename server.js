const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 4000;

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const LocalDB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`App connected with ${app.get("env")} database`));

app.listen(port, () => {
  console.log(
    `App running in ${app.get("env")} mode on ${`http://127.0.0.1:${port}`}`
  );
});
