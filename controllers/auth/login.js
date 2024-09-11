"use strict"

const { Role, User } = require("../../models")
const bcrypt = require('bcryptjs');
const { validateCaptcha } = require("./capcha");

exports.getLogin = async (req, res, next) => {
  // console.log(req.user)
  if (req.userId) {
    const _ = await User.findById(req.userId).then(
      user => {
        // console.log(user)
        if (user) {
          res.redirect("/")
        }
      }
    )
  } else {
    res.render("pages/log-in", { message: "You're not login" })
  }

}

exports.postLogin = async (req, res, next) => {
  console.log("login Req")
  const valid = await validateCaptcha(req.body['g-recaptcha-response'])
  console.log(valid)
  try {
    if (!valid) {
      return res.render("pages/log-in", { message: "Capcha not match" });
    }
    console.log("find user")
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("user not exist")
      return res.render("pages/log-in", { message: "Username does not exist. Please sign up." });
    }

    console.log("check pass")
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      console.log("password incorrect")
      return res.render("pages/log-in", { message: "Password is incorrect." });
    }

    if (user.lock == true) {
      console.log("User is locked")
      return res.render("pages/log-in", { message: "Your account is currently locked" })
    }

    console.log("assign session")
    if (result) {
      // const role = await Role.findById(user.role).then(role => role.role)
      req.session.user = {
        userId: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        cartSize: user.cart.length,
        profileImg: user.profileImg,
        phone: user.phone
      };

      console.log(req.session.user)

      console.log("Login successful");

      // sessionStorage.setItem()

      // res.redirect('/', { userInformation: req.session.user});
      return res.redirect('/');  // Redirect to homepage or dashboard
    }
  } catch (error) {
    console.error(error);
    res.render("pages/log-in", { message: "An error occurred. Please try again." });
  }
};


exports.resetPassword = async (req, res, next) => {
  return
}

exports.postLogout = async (req, res, next) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect("/")
}