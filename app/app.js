var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./db.js');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var adminLoginObj = require('./app/models/adminlogins/adminlogin.js');
var userObj = require('./app/models/users/users.js');
var constantObj = require('./constants.js');


/*var routes = require('./routes/index');
var users = require('./routes/users');*/

var app = express();
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());


//API Security - Browser Authentication/Basic Authentication
var users = [{username:'taxi', password:'application'}];
passport.use('basic',new BasicStrategy({}, function (username, password, done) {

    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (user.password != password) { return done(null, false); }
          return done(null, user);
      });
  }
));


function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


//admin login
var LocalStrategy = require('passport-local').Strategy;

  passport.use('adminLogin',new LocalStrategy(
    function(username, password, done) {
      
      adminLoginObj.findOne({username: username}, function(err, adminuser) {
       
        if(err) {
               return done(err);
        }
        
        if(!adminuser) {
           console.log("in ...adminuser" ,username);
          return done(null, false);
        }

        if(adminuser.password != password) {
              return done(null, false);
        }


        //returning specific data
        return done(null, {id: adminuser._id});

      });
    }
  ));

passport.serializeUser(adminLoginObj.serializeUser);
passport.deserializeUser(adminLoginObj.deserializeUser);
//user login
var LocalStrategy = require('passport-local').Strategy;

  passport.use('userLogin',new LocalStrategy(
    function(username, password, done) {
   
      userObj.findOne({user_name: username},{user_name:true, password:true}, function(err, user) {
console.log(user);
             
        if(err) {
               return done(err);
        }
        
        if(!user) {
             return done(null, false);
        }

        if(user.password != password) {
           return done(null, false);
        }


        //returning specific data
        return done(null, {id: user._id});

      });
    }
  ));

passport.serializeUser(userObj.serializeUser);
passport.deserializeUser(userObj.deserializeUser);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*app.use('/', routes);
app.use('/users', users);*/

require('./routes/adminlogin')(app, express, passport);
require('./routes/vehicletypes')(app, express, passport);
require('./routes/vehicles')(app, express, passport);
require('./routes/users')(app, express, passport);
require('./routes/permissions')(app, express, passport);
require('./routes/roles')(app, express, passport);
require('./routes/categories')(app, express, passport);
require('./routes/questionnaires')(app, express, passport);
require('./routes/questions')(app, express, passport);
require('./routes/answer_type')(app, express, passport);
require('./routes/techdomains')(app, express, passport);
require('./routes/candidateposition')(app, express, passport);
require('./routes/results')(app, express, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
