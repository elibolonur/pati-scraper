const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileStore = require('session-file-store')(session);

const index = require('./routes/index');
const mainPage = require('./routes/getMainPage');
const area = require('./routes/getArea');
const topic = require('./routes/getTopic');
const followedTopics = require('./routes/getTopicsFollowed');
const activeTopics = require('./routes/getActiveTopics');
const msgPage = require('./routes/getMessagePage');
const msg = require('./routes/getMessage');
const profile = require('./routes/getProfile');
const login = require('./routes/login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: app.sess,
    secret: 'SEKR37_pati',
    saveUninitialized: true,
    unset: 'destroy',
    resave: true,
    store: new fileStore()
}));

app.use('/', index);
app.use('/getMainPage', mainPage);
app.use('/getArea', area);
app.use('/getTopic', topic);
app.use('/getFollowedTopics', followedTopics);
app.use('/getActiveTopics', activeTopics);
app.use('/getMsgPage', msgPage);
app.use('/getMessage', msg);
app.use('/getProfile', profile);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
