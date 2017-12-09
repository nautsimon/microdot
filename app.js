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

app.get('/homepage', (req, res) => {
    res.sendFile(__dirname + "/views/home.html");
});

app.get('/chat/:chatID', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get('/createChat/:chatID', (req, res) => {
    createChat(req.params.chatID);
    res.send("<h1>Chat created, please go to <a>http://microdot.tech/chat/" + req.params.chatID + "</a></h1>");
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


    socket.on('joinRoom', (room) => {
        if(rooms[room] != undefined && rooms[room].users != undefined){
            rooms[room].users.push(socket.id);
            SOCKETS[socket.id].join(room);
        }
    });
    
    socket.on('sendMsg', (data) => {
        let room = Object.keys(socket.rooms)[1];
        let userId = (socket.id + "").slice(2,7);
        if(rooms[room] != undefined){
            for(var i in rooms[room].users){
                console.log(rooms[room].users[i]);
                SOCKETS[rooms[room].users[i]].emit('newMsg', {id: userId, msg: data});
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('disconnect');
        delete SOCKETS[socket.id];
    })
});


function createChat(chatID){
    rooms[chatID] = {};
    rooms[chatID].users = [];
}
