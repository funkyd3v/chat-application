// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

// internal imports
const User = require("../models/People");

function getLogin(req, res, next) {
  res.render("index");
}

// login
async function login(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        const userObj = {
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          role: "user",
        };

        const token = jwt.sign(userObj, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        // set logged in user identifier
        res.locals.loggedInUser = userObj;

        res.render("inbox");
      } else {
        throw createHttpError("Login failed! Please try again");
      }
    } else {
      throw createHttpError("Login failed! Please try again");
    }
  } catch (error) {
    res.render("index", {
      data: {
        username: req.body.username
      },
      errors: {
        common: {
          msg: error.message
        }
      }
    });
  }
}

// logout
function logout(req, res){
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("logged out");
}

module.exports = {
  getLogin,
  login,
  logout
};
