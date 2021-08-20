const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const indexRoute = require("./controllers/index");
global.config = require("./setup/config");
const app = express();
const logger = require('morgan')


mongoose.connect(
  global.config.mongoURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("Error while connecting to mongodb..");
    } else {
      console.log("Successfully connected to mongodb..");
    }
  }
);

app.use(logger('dev'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

//passport middleware
app.use(passport.initialize());
//passport-jwt middleware
require("./strategies/jwtStrategy")(passport);

app.use("/", indexRoute);

const portno = process.env.PORT || 5000;

app.listen(portno, () => {
  console.log(`Server is runnig at port no. ${portno}`);
});
