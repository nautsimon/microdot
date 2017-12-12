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
    res.sendFile(__dirname + "/views/chat.html");
});

app.get('/createChat', (req, res) => {
    var chatID = Math.random().toString(36).substring(3); // get a random ID
    chatID = chatID.replace(/[0-9]/g, ''); // sanitize out all numbers
    createChat(chatID);
    res.send("<h1>Chat created, please go to <a>http://microdot.tech/chat/" + chatID + "</a></h1>");
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
                if(SOCKETS[rooms[room].users[i]] != undefined){
                    SOCKETS[rooms[room].users[i]].emit('newMsg', {id: userId, msg: data});
                } else {
                    console.log("user doesn't exist!!");
                }
            }
        }
    });

    socket.on('disconnect', () => {
        delete SOCKETS[socket.id];
    })
});


function createChat(chatID){
    rooms[chatID] = {};
    rooms[chatID].users = [];
}
