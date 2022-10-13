require("dotenv").config();
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");
// const encrypt = require("mongoose-encryption");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/********* local mongo db connection *********/
mongoose.connect("mongodb://0.0.0.0:27017/userDB");

// console.log(md5("message"));

/*** database schema  ***/
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// secret word here

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

/********* database model ********/
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    newUser.save(function (err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          // result == true

          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started. Listening on ${PORT}`);
});
