const express = require('express');
const passport = require('passport');
const path = require('path');
const Patient = require('../model/patient');
const Doctor = require('../model/doctor');
const Appointment = require('../model/appointment');

const router = express.Router();

router.get('/', (req, res) => {
    req.logout();
    req.session.destroy();
    res.render('patient');
});

router.get('/home',authenticationMiddleware(), (req, res) => {
    res.render('patienthome');
});

router.get('/viewdoctors',authenticationMiddleware(), async(req, res) => {

    const doctors = await Doctor.find({})
    res.render('patientviewdoctors' ,{
        doctors: doctors
    });
});


router.get('/bookappointment',authenticationMiddleware(), async(req, res) => {

    const doctors = await Doctor.find({})
    res.render('patientbookappointment' ,{
        doctors: doctors
    });
});

router.post('/bookappointment',authenticationMiddleware(), async(req, res) => {

    const doctorname = JSON.parse(req.body.doctor).name
    const doctoremail = JSON.parse(req.body.doctor).email
    const patientname = req.user.name
    const patientemail = req.user.email
    const description = req.body.description
    const time = req.body.time

    const newAppointment = {
        doctorname: doctorname, 
        doctoremail: doctoremail, 
        patientname: patientname, 
        patientemail: patientemail,
        description: description,
        time: time
    }

    const appointment = await Appointment.create(newAppointment);

    res.redirect('/patient/appointments');


});

router.get('/appointments', authenticationMiddleware(), async(req, res) => {

    const appointments = await Appointment.find({patientemail: req.user.email})
    console.log(appointments)
    res.render('patientappointments', {
        appointments: appointments
    })
})






























//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/register', async(req, res) => {
    console.log(req.body)
    const {name, phone_number, age, gender, latitude, longitude, email, password} = req.body;
    try {
        const newPatient = {
            name: name,
            phone_number: phone_number,
            age: age,
            gender: gender,
            latitude: latitude,
            longitude: longitude,
            email: email,
            password: password,
            role: "patient"
            
        };
        patient = await Patient.create(newPatient);            
        res.redirect('/patient');

    } catch (error) {
        console.log(error);
        res.redirect('/patient');
    }

});


router.post('/login', async(req, res) => {
    console.log(req.body)

    const email = req.body.email;
    const password = req.body.password;  
    const latitude = req.body.latitude;
    const longitude = req.body.longitude; 

    const query = { email: email, password: password};
    
    try {
        const patient = await Patient.findOne(query);
        

        if(patient){

            await Patient.updateOne(query, {latitude: latitude, longitude: longitude}, {upsert: true})

            req.login(email, () =>{
                
                res.redirect('/patient/home')
            });
        } else {
            res.redirect('/patient');
        }


    } catch (error) {
        console.log(error);
        res.redirect('/patient');
    }

});



router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/patient')
})



function authenticationMiddleware () {  
	return (req, res, next) => {
        if (req.isAuthenticated() && req.user[0].role === 'patient') return next();       
	    res.redirect('/patient');
	}
}

// Passport Serialize and Deserialize
passport.serializeUser(function(email, done) {
    done(null, email);
  });
  
passport.deserializeUser( async(email, done) => {
await Patient.find({email: email}, (err, user) =>  done(null, user));
});

module.exports = router;