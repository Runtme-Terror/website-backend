const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Doctor = require('./model/doctor');
const passport = require('passport');
const path = require('path');

dotenv.config({path: './.env'});

const app = express();

const publicDirectory = path.join(__dirname, './public');         // Join path to public folder   
app.use(express.static(publicDirectory));                         // Serve public files like CSS,Favicon
app.use(express.urlencoded({extended: false}));                   // For parsing URL encoded bodies
app.use(express.json());

app.set('view engine', 'ejs');


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, (req, res) => {
    console.log("Connected to MongoDB Atlas");
});


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
  }))


app.use(passport.initialize());             // Initialize Passport 
app.use(passport.session());

/////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/doctor', (req, res) => {
    res.render('doctor');
});

app.get('/doctor/home', (req, res) => {
    res.render('doctorhome');
});

app.post('/doctor/register', async(req, res) => {
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
            password: password
            
        };
        doctor = await Doctor.create(newDoctor);            
        res.redirect('/doctor');

    } catch (error) {
        console.log(error);
        res.redirect('/doctor');
    }
});

app.post('/doctor/login', async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;    

    const query = { email: email, password: password};

    try {
        let doctor = await Doctor.findOne(query);
        console.log(doctor);

        if(doctor){
            req.login(email, () =>{
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


app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


// Passport Serialize and Deserialize
passport.serializeUser(function(email, done) {
    done(null, email);
  });
  
passport.deserializeUser(function(email, done) {
    done(null, email);
  });