var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var Twit=require('twit');
var twitconfig=require('./node_modules/twit/config.js');
var twit=new Twit(twitconfig);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

//create a server which listens on port 3000
var server=require('http').Server(app);
//var server=require('express').createServer()
var port=3000;

//create Websockets socket.io server object. Attach it to http server
var sio=require('socket.io')(server);
server.listen(port);

var stream=twit.stream('statuses/filter', { track: ['love','hate']/*,language: 'en'*/});


//define behavior on connection with web-client

//sio.sockets.on('connection',function(socket){

//    console.log("going_into_stream_on");
    stream.on('tweet',function(tweet) {
    
   
        if(tweet.text.toLowerCase().indexOf("love")>-1)
            sio.sockets.emit('new-tweet',{type:"love", username: tweet.user.screen_name, text: tweet.text});
        if(tweet.text.toLowerCase().indexOf("hate")>-1)
            sio.sockets.emit('new-tweet',{type:"hate",username: tweet.user.screen_name, text: tweet.text});

    //console.log("tweet sent");
    });
//    console.log("out_of_stream_on");

//});




module.exports = app;
