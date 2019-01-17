require('dotenv').load();

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var corsUrls = process.env.ACCESS_CONTROL_ALLOW_ORIGIN_URLS || '*';
var passport = require('passport');
var mongoose = require('mongoose');
var path = require('path');

var loginRouter = require('./api/routes/loginRouter');
var signupRouter = require('./api/routes/signupRouter');
var utilRouter = require('./api/routes/utilRouter');
var profileRouter = require('./api/routes/profileRouter');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", corsUrls);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Cache-Control', 'max-age=0,no-cache,no-store,post-check=0,pre-check=0,must-revalidate');
    res.header('Expires', '-1');
    next();
});

// Use the passport package in our application
app.use(passport.initialize());

// Static public
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/public/:filePath', express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/signup', signupRouter);
app.use('/api/v1/util', utilRouter);
app.use('/api/v1/profile', profileRouter);

app.use(function (req, res) {
    res.status(404).send({ url: req.originalurl + ' La URI que se ha solicitado no existe.' });
})

app.listen(port);

console.log('CinemaReel ejecutándose... en: ' + port);
