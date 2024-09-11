const mongoose = require('./connection');

const dynamicSchema = new mongoose.Schema({}, { strict: false });


const Session = mongoose.model('Session', dynamicSchema);

module.exports = Session