const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const categoriesRouter = require("./routes/categories");

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://pickleball-admin-client.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://wesellpickleball.xyz",
    ], // frontend URL
  })
);

app.use("/api/categories", categoriesRouter);

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
  });
