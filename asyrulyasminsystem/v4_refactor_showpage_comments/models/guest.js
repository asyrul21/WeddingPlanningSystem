var mongoose = require('mongoose');

var guestSchema = new mongoose.Schema({
    name: String,
    remarks: String
});

var Guest = mongoose.model("Guest", guestSchema);
module.exports = Guest;