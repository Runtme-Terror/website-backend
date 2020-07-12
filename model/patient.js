const mongoose = require('mongoose');

const Patient = new mongoose.Schema({
    
    
    name: String,
    phone_number:  {
        type: String,
        unique: true
    },
    age: Number,
    gender: String,
    email:  {
        type: String,
        unique: true
    },
    password: String,
    latitude: Number,
    longitude: Number,
    role: String

    
});

module.exports = mongoose.model("Patients", Patient);