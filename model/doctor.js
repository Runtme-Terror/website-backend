const mongoose = require('mongoose');

const Doctor = new mongoose.Schema({
    
    registration_id: {
        type: String,
        unique: true
    },
    name: String,
    phone_number:  {
        type: String,
        unique: true
    },
    email:  {
        type: String,
        unique: true
    },
    password: String    
    
});

module.exports = mongoose.model("Doctors", Doctor);