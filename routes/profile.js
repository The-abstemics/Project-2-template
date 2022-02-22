var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model");
const Drink = require("../models/Drink.model");

const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.route("/")
.get(isLoggedIn, (req, res) => {
  User.findById(req.session.userId)
  .then((profile) => {
    res.render("profile/user-profile", profile);
  });
});

router.route("/:id/edit-profile")
.get(isLoggedIn, (req, res) => {
  User.findById(req.session.userId)
  .then((user) => {
    res.render("profile/edit-profile", user)
  })
})
.post((req, res) => {
  const { age, weight, height, sex, image} = req.body;
  const id = req.session.userId;
  console.log("dudeee",req.session.userId)
  /*
  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }*/

  User.findByIdAndUpdate(id,  { age, weight, height, sex, image }, {new: true})
  .then(res.redirect("/profile"))

});

router
  .route("/add-drink")
  .get((req, res) => {
    Drink.find().then((drinks) => {
      res.render("profile/add-drink", { drinks });
    });
  })
  .post((req, res) => {
    //console.log(req.body.quantity[3])
  
    let total = 0;

    Drink.find().then((drinks) => {
      drinks.forEach((drink, idx) => {
        const alcohol_content = drink.alcohol_content;
        const quantity = req.body.quantity[idx];
        //console.log(id)
        total += (alcohol_content * quantity) / 100;
        console.log(total);
      });
      /*console.log('total:::::::::::::',alcohol_content,total)*/
      const id = req.session.userId;
      User.findByIdAndUpdate(
        id,
        { $set: { bac: total } },
        { new: true }
      ).then((modifiedUser) => res.redirect("/"));
    });
  });

module.exports = router;
