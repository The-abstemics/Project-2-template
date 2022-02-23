var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model");
const Drink = require("../models/Drink.model");

const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");
const session = require("express-session");


function getProfileImg(bac) {
  let imgUrl = "";
  if (bac < 0.5) imgUrl = "/images/start.jpg";
  else if (bac >= 0.5 && bac <= 0.8) imgUrl = "/images/drink.jpg";
  else imgUrl = "/images/wasted.jpg";
  return imgUrl;
}

router.route("/").get(isLoggedIn, (req, res) => {
  User.findById(req.session.userId)
    .populate("favorite_drinks")
    .then((user) => {
    res.render("profile/user-profile", {
      user,
      profileImg: getProfileImg(user.bac),
    });
  });
});

router.get("/delete-profile", isLoggedIn, (req, res) => {
  User.findByIdAndDelete(req.session.userId)
    .then(() => {
      req.session.destroy((err) => {
        if (err) {
          return res
            .status(500)
            .render("auth/logout", { errorMessage: err.message });
        }
        res.redirect("/");
      });
    })
    .catch((err) => `Something went wrong when deleting the profile: ${err}`);
});

///-----EDIT PROFILE-----//

router
  .route("/:id/edit-profile")
  .get(isLoggedIn, (req, res) => {
    User.findById(req.session.userId).then((user) => {
      res.render("profile/edit-profile", user);
    });
  })
  .post((req, res) => {
    const { age, weight, height, sex } = req.body;
    const id = req.session.userId;

    User.findByIdAndUpdate(
      id,
      { age, weight, height, sex },
      { new: true }
    ).then(res.redirect("/profile"));
  });

//------ADD-DRINK------//

router
  .route("/add-drink")
  .get((req, res) => {
    Drink.find().then((drinks) => {
      res.render("profile/add-drink", { drinks });
    });
  })
  .post((req, res) => {
    let total = 0;
    Drink.find().then((drinks) => {
      drinks.forEach((drink, idx) => {
        const alcohol_content = drink.alcohol_content;
        const volumen = drink.size;
        const quantity = req.body.quantity[idx];
        const alcoholDensity = 0.8;

        total +=
          (alcohol_content / 100) * (quantity * volumen) * alcoholDensity;
      });

      User.findById(req.session.userId).then((user) => {
        const weight = user.weight;
        const gender = user.sex;
        const userStartDrink = user.startDrinking;
        let r = 0;
        let bac = 0;
        let date = new Date();
        const timeNow = date.getTime();
        //Si total === 0 que no cambie el timedrinking
        let timeDrinking = timeNow - userStartDrink;

        if (total === 0) timeDrinking = 0;

        console.log(timeNow);
        console.log(userStartDrink);
        console.log("timeDrinking:", timeDrinking);

        gender === "male" ? (r = 0.6) : (r = 0.7);

        bac = total / (weight * r) + (user.bac - (timeDrinking / 3600000) * 0.015);
        bac = Number(bac.toFixed(2));
        user.bac = bac;
        user.save().then(() => {
          res.redirect("/profile");
        });
      });
    });
  });

//-----RESET-COUNTER-----//
router.route("/reset-counter").post((req, res) => {
  User.findByIdAndUpdate(
    req.session.userId,
    { bac: 0}
  ).then(() => res.redirect("/profile"));
});

//-------Search------

router.get("/search", (req, res) => {
  const drinkName = req.query.drinkName.toLowerCase();
  //console.log("DRINKNAME!!!!!", drinkName)
  if (!drinkName) {
    res.render("partials/drinkpartial", {
      errorMessage: "You need to type something droogie",
    });
  } else {
    Drink.find({ name: { $regex: `^.*${drinkName}.*$` } }).then((drinks) => {
      res.render("partials/drinkpartial", { drinks });
    });
  }
});

module.exports = router;
