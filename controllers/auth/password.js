const bcrypt = require('bcryptjs');
const { User } = require("../../models")

const changePass = async (req, res, next) => {
    console.log(req.body)
    try {
        let { oldPass, newPass } = req.body
        const user = await User.findById(req.session.user.userId)
        let userPass = user.password

        const valid = await bcrypt.compare(oldPass, userPass)

        if (valid) {
            newPass = await bcrypt.hash(newPass, 10)
            user.password = newPass
            await user.save()
            req.session.destroy()
            return res.redirect("/login")
        } else {
            const id = req.session.user.userId
            const user = await User.findById(id)
            const path = `/account/edit/${user.id}`;
            return res.render('pages/editAccount', { user, title: "Edit Account", path: path, message: "Old Password is not correct" })
        }

    } catch (e) {
        console.log(e)
        res.redirect("/account")
    }
}

module.exports = changePass