const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const io = require('socket.io')();
// const http = require('http');

const app = express();
app.use(cors());

const users = require('./routes/api/user');
const profile = require('./routes/api/profile');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require('./keys/keys').mongoURI;

//Connect to MongoDB
mongoose
    .connect(db,
        { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

// Passport Config
require('./keys/passport')(passport);

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

// Sockets
/*
const server = http.Server(app);
const io = require('socket.io')(server);

server.listen(80);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../components/Chat/Chat.js')
});

io.on('connection', (socket) => {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', (data) => {
        console.log(data);
    })
});*/

io.on('connection', (socket) => {
    socket.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            socket.emit('timer', new Date());
        }, interval);
    });

    console.log('New user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message:' + msg);
        io.emit('recieve', msg);
    });
});

const socketPort = 8000;
io.listen(socketPort);
console.log('Socket port ', socketPort);