const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");
const User = require("../models/People");

// get all usersz
async function getUser(req, res, next) {
  try {
    const users = await User.find();
    res.render("users", {
      users: users,
    });
  } catch (error) {
    next(error);
  }
}

// add user
async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  // save user or send error
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        common: {
          msg: "Unknown error ocured!",
        },
      },
    });
  }
}

// delete user
async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    // remove avatar
    if (user.avatar) {
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    res.status(200).json({
      message: 'User removed successfully!',
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: 'Could not delete the user!'
        }
      }
    });
  }
}

module.exports = {
  getUser,
  addUser,
  removeUser,
};
