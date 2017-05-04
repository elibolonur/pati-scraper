const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

const cors = require('cors');

const index = require('./routes/index');
const login = require('./routes/login');
const mainPage = require('./routes/getMainPage');
const area = require('./routes/getArea');
const topic = require('./routes/getTopic');
const followedTopics = require('./routes/getTopicsFollowed');
const activeTopics = require('./routes/getActiveTopics');
const msgPage = require('./routes/getMessagePage');
const msg = require('./routes/getMessage');
// const postTopic = require('./routes/postTopic');
const profile = require('./routes/getProfile');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', index);
app.use('/login', login);
app.use('/getMainPage', mainPage);
app.use('/getArea', area);
app.use('/getTopic', topic);
app.use('/getFollowedTopics', followedTopics);
app.use('/getActiveTopics', activeTopics);
app.use('/getMsgPage', msgPage);
app.use('/getMessage', msg);
// app.use('/postTopic', postTopic);
app.use('/getProfile', profile);

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
