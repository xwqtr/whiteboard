const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
var fs = require('fs');
var http = require('http');
var https = require('https');
// const MongoClient = require('mongodb').MongoClient;
const errorHandler = require('errorhandler');
const passport = require('passport');

const BearerStrategy = require('passport-http-bearer');
require('./models/Users');
//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();
//Configure our app

app.use(cors());

app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'KaU9czgGdYGtZ5i6T4YSngau', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Configure Mongoose
mongoose.connect('mongodb://localhost/passport', {useNewUrlParser: true});
mongoose.set('debug', true);
app.post('/login', 
  passport.authenticate('local'),
  (req, res)=> {
    console.log(req.user);
    res.redirect('/');
  });


if(!isProduction) {
  app.use(errorHandler());
}



const User = mongoose.model('User');
const LocalStrategy = require('passport-local').Strategy;
var rz = (rq,res,next)=> {
  console.log("4343");
  next();
};
var ls = new LocalStrategy(
  function(username, password, done) {
    console.log("From Local Strategy");
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { var newuser = new User();
        newuser.username = username;
        newuser.setPassword(password);
        newuser.save().then((x)=> {
        user=x;
        if (!user.validatePassword(password)) { 
          return done(null, user, { message: 'User created.' });
        }
      }); }
      
      return done(null, user);
    });
  }
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(rz);
passport.use(ls);

var options = {
  pfx: fs.readFileSync('./sslcert/myexport.pfx'),
  passphrase: 'P@ssw0rd'
};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

httpServer.listen(8080);
httpsServer.listen(8443);
// app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
