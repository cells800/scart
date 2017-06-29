var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
// initiate connect-mongo and store session
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();
// stripe payment required
const keyPublishable = "pk_iA4yhIvVYDbQXSX3qNy4ioAL1HQIU";
const keySecret = "Bdjh057jOSfL4bfhe12zNqlaAKKQAYiC";

//const keyPublishable = process.env.PUBLISHABLE_KEY;
//const keySecret = process.env.SECRET_KEY;

const stripe = require("stripe")(keySecret);
// stripe payment required

mongoose.connect('localhost:27017/shopping')
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  //each connection is new
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  // cookie time: minute x sec * msec
  cooke: { maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  // make session available to all View template 
  res.locals.session = req.session;
  next();
});

// Stripe routes starts
//app.get("/", (req, res) =>
//  res.render("/shop/index.hbs", {keyPublishable}));

app.use('/', routes );

app.post("/shop/charge.hbs", (req, res) => {
  var amount = 500;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "SS Sample Charge",
         currency: "USD",
         customer: customer.id
    }))
  .then(charge => res.render("charge.pug"));
});

//app.listen(4567);

// Stripe routes end


app.use('/user', userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
