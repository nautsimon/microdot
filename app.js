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
    res.sendFile(__dirname + "/views/index.html");
});

server.listen(8080);


/*
  === SOCKET.IO ===
*/

var SOCKETS = {};
var rooms = {};

io.sockets.on('connection', (socket) => {
    socket.id = Math.random(); // assign the user a random ID
    SOCKETS[socket.id] = socket;
    rooms["test"] = ""; // define a test room.

    socket.on('joinRoom', (room) => {
        if(rooms[room] != undefined){
            console.log("haha");
            //SOCKETS[socket.id].leave(Object.keys(socket.rooms)[1]);
            SOCKETS[socket.id].join(room);
        }
    });
    
    socket.on('sendMsg', (data) => {
        console.log(socket.room);
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
