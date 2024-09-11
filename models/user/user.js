const mongoose = require("../connection")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    // Profile img
    profileImg: {
        type: String,
        default: "/images/userImage/userimage.jpg"
    },
    // Comment on Product
    reviewIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    // Role [User, Admin]
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    lock: {
        type: Boolean,
        default: false,
    },

    // cart Product
    cart: [{
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product"
        }
    }],
    phone: {
        type: String,
        default: null
    }
}, { timestamps: true })

const User = mongoose.model(
    "User", userSchema
)

module.exports = User