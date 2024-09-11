"use strict"

const { User } = require("../../models")

const bcrypt = require('bcryptjs');
const { validateCaptcha } = require("./capcha");

const checkUserValid = async ({ username, email }) => {
    const emailValid = await User.findOne({ email: email })
    if (emailValid) {
        return emailValid.username === username
    }
    return false



}

exports.getReset = (req, res, next) => {
    res.render("pages/reset", { title: "Reset", path: req.path, message: "" })
}


exports.postReset = async (req, res, next) => {
    try {
        console.log("reset")
        const validCapcha = await validateCaptcha(req.body['g-recaptcha-response'])
        if (!validCapcha) {
            return res.render("pages/reset", { title: "Reset", path: req.path, message: "capcha not Mactch" })
        }

        const valid = await checkUserValid(req.body)
        console.log("Check Valid", valid)

        if (!valid) {
            return res.render("pages/reset", { title: "Reset", path: req.path, message: "Username or password is not correct" })
        } else {
            const user = await User.findOne({ username: req.body.username })

            let newPassword = req.body.newPassword
            newPassword = await bcrypt.hash(newPassword, 10)

            user.password = newPassword
            await user.save()


            return res.render("pages/log-in", { title: "Reset", path: req.path, message: "Reset Password successful" })
        }
    } catch (e) {
        console.log(e)

        return res.render("pages/reset", { title: "Reset", path: req.path, message: "An Error Occur, please try again" })
    }
}