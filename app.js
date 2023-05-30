
var express = require('express');
const session = require('express-session');
const port = process.env.PORT || 3000
const { ExpressOIDC } = require('@okta/oidc-middleware');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

require('dotenv').config()

var app = express();
const oidc = new ExpressOIDC({
  issuer:`${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  appBaseUrl: process.env.OKTA_BASEAPP_URL,
  loginRedirectUri: `${process.env.OKTA_BASEAPP_URL}/callback`,
  scope: 'openid profile',
  routes: {
    loginCallback: {
      path: '/callback'
    },
    afterCallback: '/'
  }
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(port, () => console.log(`JWT server listening on port ${port}!`))

module.exports = app;
