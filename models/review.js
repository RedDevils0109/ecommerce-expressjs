const mongoose = require('./connection');
const Schema = mongoose.Schema;

// Define the Reply schema


// Define the Comment schema
const reviewSchema = new Schema({
    body: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: true
})

// Create a model for Comment using the defined schema
const Review = mongoose.model('Review', reviewSchema);

// Export the model
module.exports = Review;
