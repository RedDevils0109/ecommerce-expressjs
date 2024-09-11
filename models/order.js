const mongoose = require("./connection");

const orderSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        
        quantity: {
            type: Number,
            min: 1
        }
    }],

    status: {
        type: String,
        enum: ["Delivering", "Delivered", "Cancel"],
        default: "Delivering"
    },

    total: {
        type: Number,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)

module.exports = Order