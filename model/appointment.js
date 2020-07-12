const mongoose = require('mongoose');

const Appointment = new mongoose.Schema({
    
    doctorname: String,
    doctoremail: String,
    patientname: String,
    patientemail: String,
    description: String,
    time: Date
    
});

module.exports = mongoose.model("Appointments", Appointment);