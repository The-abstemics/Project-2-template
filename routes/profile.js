var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model");
const Drink = require("../models/Drink.model");

const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.route("/").get(isLoggedIn, (req, res) => {
  User.findById(req.session.userId).then((profile) => {
    console.log(profile);
    res.render("profile/user-profile", profile);
  });

  // res.render("profile/user-profile")
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
      User.findByIdAndUpdate(id, { $set: { bac: total } }, { new: true }).then(
        (modifiedUser) => res.redirect("/")
      );
    });
  });

router.get("/add-drink/search", (req, res) => {
  const drinkName = req.query.drinkName;
  console.log("DRINKNAME!!!!!", drinkName)
  if (!drinkName) {
      res.render("profile/add-drink", 
      {errorMessage: "You need to type something droogie"})
      
  } else {
    Drink.find({ name: {$regex: `^.*${drinkName}.*$`} })
      .then((drinks) => {
          res.render("profile/add-drink", {drinks})
          })
  }

});

module.exports = router;
