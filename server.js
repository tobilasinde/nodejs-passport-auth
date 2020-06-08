var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var auth = require('./modules/auth.js');
var app = express();

var multer  = require('multer')
var routes = require('./routes/index');


app.locals.moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// passport initialization
auth.initializeStrategy(passport);
app.use(passport.initialize());
app.use(passport.session())
app.set('passport', passport);

const isWhiteListed = ( path, whiteList = [ 'login', 'signup' ] ) => {
  let whiteListed = false;
  for(let i=0; i < whiteList.length; i++) {
      // this won't check authentication for login and autoLogin
      // add logic here if you want to check POST or GET method in login
      if( path.indexOf( whiteList[ i ] ) !== -1 ) {
          whiteListed = true;
      }
  }
  return whiteListed;
};

const authenticationMiddleware = (req, res, next) => {
  if( isWhiteListed(req.originalUrl) || req.isAuthenticated() ) {
      return next();
  }

  res.redirect('/login');
};
app.use( authenticationMiddleware );

app.use('/', routes);
//app.use('/users', users);
//app.use('/chatapp', chatapp);
//app.use('/message', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


module.exports = app;
