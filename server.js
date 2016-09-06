'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var request         = require('request');

var app = express();
var server = require('http').createServer(app);

var port = process.env.PORT || 4000;

app.io = require('socket.io')();
app.io.attach(server);


app.use(morgan('dev'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(process.cwd() + '/public'));

app.set('views', process.cwd() + '/views');
app.set('view engine', 'pug');


require('./routes/index')(app);

server.listen(port,function () {
    console.log('Express running on port ' + port);
});

app.io.on('connection', function (socket) {
    console.log('user connected');
    
    socket.on('message', function (data) {
        console.log('message: ',data);
        app.io.emit('message',data);
    });
});

