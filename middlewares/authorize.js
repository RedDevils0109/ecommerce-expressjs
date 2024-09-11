module.exports = async (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role == "admin") {
            next()
        } else {
            res.redirect("back")
        }
    } else {
        res.render("pages/log-in", { message: "You're not authorize as Admin" })
    }
}
