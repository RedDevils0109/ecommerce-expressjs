const mongoose = require('./connection'); // Import the mongoose connection setup

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['mobile', 'laptop', 'headphone'],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    mainImg: {
        type: String,
        required: true
    },
    subImg: {
        type: [String]

    },
    videoUrl: {
        type: String
    },
    ram: {
        type: String
    },
    storage: {
        type: String
    },
    quantity: {
        type: Number,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    reviewIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
