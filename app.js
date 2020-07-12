const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Doctor = require('./model/doctor');
const passport = require('passport');
const path = require('path');
const doctorRoute = require('./routes/doctor');
const patientRoute = require('./routes/patient');

dotenv.config({path: './.env'});

const app = express();





app.set('view engine', 'ejs');


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, (req, res) => {
    console.log("Connected to MongoDB Atlas");
});


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: { secure: false } 
  }))


app.use(passport.initialize());             // Initialize Passport 
app.use(passport.session());

const publicDirectory = path.join(__dirname, './public');         // Join path to public folder   
app.use(express.static(publicDirectory));                         // Serve public files like CSS,Favicon
app.use(express.urlencoded({extended: false}));                   // For parsing URL encoded bodies
app.use(express.json());

app.use('/doctor', doctorRoute);
app.use('/patient', patientRoute);

/////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.render('landing');
});








