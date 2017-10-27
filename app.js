const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const logger = require('morgan');
const passport=require('passport')
const LocalStategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const database=require('./config/database.js')
const expressValidator = require('express-validator');



const index = require('./routes/index');
const users = require('./routes/users');
const admin = require('./routes/admin');



//database connection
const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

//connect to mongodb locally
//mongoose.connect(config.mongo);

//connect to database
mongoose.connect(database.mongo);

const db = mongoose.connection;

db.on('error', function (err) {
  console.log(err);
});

db.once('open', function () {
  console.log('handshake established')
});

//to use eventually- database


const app = express();

// view engine setup
app.set('view engine','ejs');
app.use('/assets', express.static('assets'));


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', express.static(path.join(__dirname, 'public')))

// Express Session
app.use(session({
  secret: '783945y4ohw&$%@^&%&@*(OKOMNU*N((N*Y78ynevwhtuw@!!()&%&^',
  saveUninitialized: true,
  resave: true
}));

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    const namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', index);
app.use('/', users);
app.use('/admin', admin);


app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//handle server error (500)
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);

})
//set port
app.set('port', (process.env.PORT) || 8080);

//listen to port
app.listen(app.get('port'), function () {
  console.log('listening @ 8080')
})

module.exports = app;