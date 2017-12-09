const https = require('http');
const express = require("express")
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

/*
  === WEBSERVER CONFIG ===
*/

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get('/chat/:chatID', (req, res) => {
    
});

server.listen(8080);


/*
  === SOCKET.IO ===
*/

var SOCKETS = {};

io.sockets.on('connection', (socket) => {
    socket.id = Math.random(); // assign the user a random ID
    SOCKETS[socket.id] = socket;

    socket.on('sendMsg', (data) => {
        for(var i in SOCKETS){
            let userId = (socket.id + "").slice(2,7);
            SOCKETS[i].emit('newMsg', {id: userId, msg: data});
        }
    });

    socket.on('disconnect', () => {
        console.log('disconnect');
        delete SOCKETS[socket.id];
    })
});
