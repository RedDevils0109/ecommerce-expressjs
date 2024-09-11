const { User } = require('../models'); // Import your User model

const updateUser = async (req, res, next) => {
    const user = await User.findById(req.body.userId)
    Object.keys(user).map(item => {
        if (req.body[item[0]]) {
            user[item[0]] = req.body.userId[item[0]]
        }
    })

    try {
        await user.save()
        
        console.log("Update Success")
        res.redirect("/admin/user")
    } catch(e) {

        console.log("Update Fail")
        res.redirect("/admin/user")
    }
}

const deleteUser = async (req, res, next) => {
    try {
        if (req.session.user.role == "admin") {
            const user = await User.findByIdAndDelete(req.body.userId)
            console.log("Update Success")
            res.redirect("/admin/user")
        }
    } catch(e) {
        console.log("Update Fail")
        res.redirect("/admin/user")
    }
}

module.exports = {deleteUser, updateUser}
