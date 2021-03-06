var express = require("express");
const app = express();
var cors = require("cors");

var logger = require("morgan");

const cookieParser = require("cookie-parser");

const favicon = require("serve-favicon");

const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const hbs = require("hbs");

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs

  app.use(cors());
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Normalizes the path to the views folder
  app.set("views", path.join(__dirname, "..", "views"));
  // Sets the view engine to handlebars
  app.set("view engine", "hbs");


  hbs.registerPartials(path.join(__dirname, "../views/partials"));

  hbs.registerHelper("capitalize", function (name) {
    let cuts = name.split(" ");
    for (let i = 0; i < cuts.length; i++) {
      let j = cuts[i].charAt(0).toUpperCase();
      cuts[i] = j + cuts[i].substr(1);
    }
    return cuts.join(" ");
  });
  hbs.registerHelper('firstWord',function(name){
    return name.split(' ')[0] ;
  })
  hbs.registerHelper("math", function (bac) {
    if (bac > 0.25) {
      return bac / 0.25;
    } else return 0;
  });

  // Handles access to the public folder
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Handles access to the favicon
  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );

  app.use(
    session({
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
      secret: process.env.SESSION_SECRET || "super hyper secret key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
    })
  );
};
