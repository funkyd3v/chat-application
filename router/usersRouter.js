// external imports
const express = require("express");

// internal imports
const { getUser, addUser, removeUser } = require("../controller/userController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler
} = require("../middlewares/users/userValidator");
const {checkLogin, redirectLoggedIn} = require("../middlewares/common/checkLogin");

const router = express.Router();

router.get("/", decorateHtmlResponse("Users"), checkLogin, getUser);

router.post(
  "/",
  checkLogin,
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

// delete user
router.delete("/:id", removeUser);

module.exports = router;
