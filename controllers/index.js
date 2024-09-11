const { getLogin, postLogin, postLogout } = require("./auth/login")
const { getSignup, postSignup } = require("./auth/signup")
const { addToCart, getCart, deleteCartItem, updateCartItem, postOrder} = require("./cart")
const { updateUser, deleteUser } = require("./user")
const changePass = require("./auth/password")
const { getReset, postReset } = require("./auth/reset-pass")



module.exports = { 
    getLogin,
    postLogin, 
    getSignup,
    postSignup,
    addToCart,
    postLogout,
    getCart,
    deleteCartItem,
    updateUser,
    deleteUser,
    postOrder,
    changePass,
    getReset,
    postReset
}