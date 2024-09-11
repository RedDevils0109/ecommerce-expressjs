"use strict";

const { Router } = require("express"); // import router from express
const { User } = require("../../models"); // import user model
const bcrypt = require('bcryptjs'); // import bcrypt to hash passwords

// import controller
const { getLogin, postLogin, getSignup, postSignup, postLogout, changePass, getReset, postReset } = require("../../controllers");

const router = Router(); // create router to create route bundle

const SECRET = process.env.SECRET_KEY;

// Signup route to create a new user
router.get("/signup", getSignup)
router.post("/signup", postSignup)

// login page
router.get('/login', getLogin)
router.post('/login', postLogin)

router.post('/logout', postLogout)

router.post('/change-password', changePass)

router.get("/reset", getReset)

router.post("/reset", postReset)


module.exports = router
