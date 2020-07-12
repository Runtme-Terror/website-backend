const express = require('express');
const passport = require('passport');
const path = require('path');
const Doctor = require('../model/doctor');


const router = express.Router();

router.get('/', (req, res) => {
    req.logout();
    req.session.destroy();
    res.render('doctor');
});

router.post('/register', async(req, res) => {
    const registration_id = req.body.registration_id;
    const name = req.body.name;
    const phone_number = req.body.phone_number;
    const email = req.body.email;
    const password = req.body.password;    

    try {
        const newDoctor = {
            registration_id: registration_id,
            name: name,
            phone_number: phone_number,
            email: email,
            password: password,
            role: "doctor"
            
        };
        doctor = await Doctor.create(newDoctor);            
        res.redirect('/doctor');

    } catch (error) {
        console.log(error);
        res.redirect('/doctor');
    }
});

router.post('/login', async(req, res) => {

    // console.log(req.body)

    const email = req.body.email;
    const password = req.body.password;    

    const query = { email: email, password: password};

    try {
        let doctor = await Doctor.findOne(query);
        console.log(doctor);

        if(doctor){
            req.login(doctor, () =>{
                res.redirect('/doctor/home')
            });
        } else {
            res.redirect('/doctor');
        }


    } catch (error) {
        console.log(error);
        res.redirect('/doctor');
    }


});


router.get('/home', authenticationMiddleware(), (req, res) => {
    res.render('doctorhome');
});







function authenticationMiddleware () {  
	return (req, res, next) => {
        console.log(req.isAuthenticated())
        if (req.isAuthenticated() && req.user.role ==="doctor") return next();        
	    res.redirect('/doctor');
	}
}


// Passport Serialize and Deserialize
passport.serializeUser(function(doctor, done) {
    done(null, doctor.id);
  });
  
passport.deserializeUser( (id, done) => {
Doctor.findById(id, (err, doctor) =>  done(null, doctor));
});

module.exports = router;