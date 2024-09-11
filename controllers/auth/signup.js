"use strict"

const { User } = require("../../models")

const bcrypt = require('bcryptjs');
const { validateCaptcha } = require("./capcha");

const checkUserValid = async ({ username, email }) => {
    const emailValid = await User.findOne({ email: email }).then(item => { return item ? true : false })
    console.log(emailValid)

    const userValid = await User.findOne({ username: username }).then(item => { return item ? true : false })
    console.log(userValid)

    const valid = (userValid || emailValid) ? true : false
    return valid
}

exports.getSignup = (req, res, next) => {
    res.render("pages/sign-up", { title: "Sign up", path: req.path })
}


exports.postSignup = async (req, res, next) => {
    console.log("Signup")
    // const validCapcha = await validateCaptcha(req.body['g-recaptcha-response'])
    // if (!validCapcha) {
    //     return res.render("pages/sign-up", { title: "Sign Up", path: req.path, message: "Capcah not Mactch" })
    // }

    const valid = await checkUserValid(req.body)
    console.log("Check Valid", valid)

    if (valid) {
        res.render("pages/sign-up", { title: "Sign Up", path: req.path, message: "Username or email already in used" })
    } else {
        const userRole = "user";

        console.log(userRole)

        // hash passwordss
        const userInfo = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: userRole,
            number: req.body.number
        };

        console.log(userInfo)
        userInfo.password = await bcrypt.hash(userInfo.password, 10);
        console.log(userInfo)

        const newAccount = new User(userInfo)
        try {
            newAccount.save()
        } catch (e) {
            console.log(e)
            res.render("pages/sign-up", { title: "Sign Up", path: req.path })
        }
        // user.create(userInfo)
        res.render("pages/log-in", { message: "Sign Up success full" })
    }
}