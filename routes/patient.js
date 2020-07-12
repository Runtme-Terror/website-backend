const express = require('express');
const passport = require('passport');
const path = require('path');
const Patient = require('../model/patient');


const router = express.Router();

router.get('/', (req, res) => {
    req.logout();
    req.session.destroy();
    res.render('patient');
});

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
    // console.log(req.body)

    const email = req.body.email;
    const password = req.body.password;    

    const query = { email: email, password: password};
    
    try {
        const patient = await Patient.findOne(query);
        console.log(patient.id);

        if(patient){
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

router.get('/home',authenticationMiddleware(), (req, res) => {
    res.render('patienthome');
});




function authenticationMiddleware () {  
	return (req, res, next) => {
        // console.log(req.user[0])
        // console.log(req.isAuthenticated())
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
// console.log(email)
// done(null, email);

});

module.exports = router;