const mongoose = require('mongoose');

const User = new mongoose.Schema({
    
    name: String,
    email: String,
    password: String,
    dob: String,
    city: String,
    state: String,
    role: String
    
});

module.exports = mongoose.model("Users", User);