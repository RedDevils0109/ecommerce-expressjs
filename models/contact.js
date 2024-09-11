const mongoose = require("./connection")

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    feedback: {
        type: String
    },
    description: {
        type: String
    },
    check: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
