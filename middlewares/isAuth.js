/**
 * If the user is already Login
 * the function would map the Id of the user into the req
 * 
 * req.username = username
 * req.userId = _id
 */
"use strict";

const Role = require("../models")



const isAuth = async (req, res, next) => {
    if (req.method == "POST" &&
        !req.session.user && req.path != "/login" && req.path != "/signup" && req.path != '/reset') {
        res.render("pages/log-in")
    } else {
        try {
            res.locals.userId = req.session.user.userId;
            res.locals.username = req.session.user.username;
            res.locals.role = req.session.user.role;
            res.locals.name = req.session.user.name;
            res.locals.email = req.session.user.email;
            res.locals.cartSize = req.session.user.cartSize;
            res.locals.profileImg = req.session.user.profileImg;
            res.locals.phone = req.session.user.phone;

            const role = Role.findById(es.locals.role).role

            if (role == 'admin') {
                console.log("admin")
            }
        } catch (e) { }
        next()
    }
}

module.exports = isAuth