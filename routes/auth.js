var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model");

const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

///////////////////////////// SIGNUP //////////////////////////////////

router
  .route("/signup")
  .get(isNotLoggedIn, (req, res) => {
    res.render("auth/signup");
  })
  .post((req, res) => {
    const { username, sex, weight, age, password } = req.body;

    if (!username || !password || !sex || !weight || !age) {
      return res
        .status(400)
        .render("auth/signup", {
          errorMessage: "Please fill up all the details.",
        });
    }

    if (age < 18) {
      return res
        .status(400)
        .render("auth/signup", {
          errorMessageAge: "You got to be at least 18 years old",
        });
    }

    if (password.length < 8) {
      return res.status(400).render("auth/signup", {
        errorMessage: "Your password needs to be at least 8 characters long.",
      });
    }
    User.findOne({ username }).then((found) => {
      // If the user is found, send the message username is taken
      if (found) {
        return res
          .status(400)
          .render("auth/signup", {
            errorMessageUser: "Username already taken.",
          });
      }
      // if user is not found, create a new user - start with hashing the password
      return bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
          // Create a user and save it in the database

          return User.create({
            username,
            sex,
            weight,
            age,
            password: hashedPassword,
          });
        })
        .then((user) => {
          req.session.userId = user._id;
          let date = new Date();
          const date1 = date.getTime();
          User.findByIdAndUpdate(
            user._id.toString(),
            { startDrinking: date1 },
            { new: true }
          ).then((updatedUser) => {
            res.redirect("/profile");
          })
        });
    })
    .catch((err) => console.log(`There was an error: ${err}`));
  });

///////////////////////////// LOGIN //////////////////////////////////

router
  .route("/login")
  .get(isNotLoggedIn, (req, res) => {
    res.render("auth/login");
  })
  .post(isNotLoggedIn, (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .render("auth/login", {
          errorMessage: "Please provide your login details.",
        });
    }

    User.findOne({ username }).then((user) => {
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            return res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
          }
          req.session.userId = user._id;
        })
        .then(() => {
          let date = new Date();
          const date1 = date.getTime();
          User.findByIdAndUpdate(
            user._id.toString(),
            { startDrinking: date1 },
            { new: true }
          ).then(() => {
            res.redirect("/profile");
          });
        })
        .catch((err) => console.log(`There was an error: ${err}`));
    });
  });

///////////////////////////// LOGOUT //////////////////////////////////

router.get("/logout", isLoggedIn, (req, res) => {
  User.findByIdAndUpdate(req.session.userId, { bac: 0 }, { new: true })
  .then(() => {
      req.session.destroy((err) => {
        if (err) {
          return res
            .status(500)
            .render("auth/logout", { errorMessage: err.message });
        }
        res.redirect("/");
      });
    }
  )
  .catch((err) => console.log(`There was an error: ${err}`));
});

///////////////////////////// DISCLAIMER //////////////////////////////////

router.get("/disclaimer", (req, res) => {
  res.render("disclaimer");
});

module.exports = router;
