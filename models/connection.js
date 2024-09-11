const mongoose = require('mongoose');
const env = require('dotenv')
env.config();

mongoose.connect(process.env.URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

module.exports = mongoose;
