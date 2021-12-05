const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/authRoute");

const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to DB...");
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err.code);
    process.exit(1);
  });
