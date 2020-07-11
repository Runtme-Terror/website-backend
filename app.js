const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Doctor = require('./model/doctor');
const passport = require('passport');
const path = require('path');
const doctorRoute = require('./routes/doctor');

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


app.use('/doctor', doctorRoute);

/////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.render('landing');
});







app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


