const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // pass user info to the html response
      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (error) {
        if (res.locals.html) {
            res.redirect("/");
        } else {
            res.status(500).json({
                errors: {
                    common: {
                        msg: "Authentication failure!"
                    }
                }
            });
        }
    }
  } else {
    if (res.locals.html) {
        res.redirect("/");
    } else {
        res.status(401).json({
            error: "Authentication failure!"
        });        
    }
  }
};

const redirectLoggedIn = function (req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (!cookies) {
    next();
  } else {
    res.redirect("/inbox");
  }
};

function requireRole(role){
  return function(req, res, next){
    if (req.user.role && role.includes(req.user.role)) {
      next();
    } else {
      if (res.locals.html) {
        next(createHttpError(401, "You are unathorized"));
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: "You are unathorized!"
            }
          }
        });
      }
    }
  }
}

module.exports = {
  checkLogin,
  redirectLoggedIn,
  requireRole
};