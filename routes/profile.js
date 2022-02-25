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
  if (bac < 0.14) imgUrl = "/images/beer.png";
  else if (bac >= 0.14 && bac <= 0.25) imgUrl = "/images/ice-bucket.png";
  else if (bac >= 0.26 && bac <= 0.35) imgUrl = "/images/treat.png";
  else if (bac >= 0.26 && bac <= 0.35) imgUrl = "/images/friends.png";
  else imgUrl = "/images/drunk.png";
  return imgUrl;
}

/*-----DELETE PROFILE-----*/


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
    const { age, weight, sex } = req.body;
    const id = req.session.userId;

    User.findByIdAndUpdate(id, { age, weight, sex }, { new: true }).then(
      res.redirect("/profile")
    );
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
        console.log(quantity);
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
        let i = 1;
        const timeNow = date.getTime();

        let timeDrinking = timeNow - userStartDrink;

        if (total === 0) {
          timeDrinking = 0;
        } else {
          i = 2;
        }

        gender === "male" ? (r = 0.6) : (r = 0.7);

        bac =
          (total / (weight * r) +
            (user.bac - (timeDrinking / 3600000) * 0.015)) /
          i;
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
  User.findByIdAndUpdate(req.session.userId, { bac: 0 }).then(() =>
    res.redirect("/profile")
  );
});


//-----PROFILE-----*/


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


module.exports = router;
