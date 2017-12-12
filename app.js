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

/*join a chatroom*/
app.get('/chat/:chatID', (req, res) => {
    res.sendFile(__dirname + "/views/chat.html");
});

/*endpoint to request for a new chat, creates a random chatID*/
app.get('/createChat', (req, res) => {
    let chatID = Math.random().toString(36).substring(3); // get a random ID
    chatID = chatID.replace(/[0-9]/g, ''); // sanitize out all numbers
    createChat(chatID);
    res.send("<h1><a href=\"http://microdot.tech/chat/" + chatID + "\">Chat created<a></h1>");
});

server.listen(8080);


/*
  === SOCKET.IO ===
*/

/*
  Total list of connected sockets (listed by their socket.id)
*/
var SOCKETS = {};
/*
  This is a way around a problem with the socket rooms.
  However, socket.io rooms as are used as well, just as a form of checking.
*/
var rooms = {};

io.sockets.on('connection', (socket) => {
    socket.id = Math.random(); // assign the user a random ID
    SOCKETS[socket.id] = socket; // add socket to list of sockets


    /*user requests to join a chatroom*/
    socket.on('joinRoom', (room) => {
        /*does the room exist and does the user exist*/
        if(rooms[room] != undefined && rooms[room].users != undefined){
            rooms[room].users.push(socket.id); // add user to room
            SOCKETS[socket.id].join(room); // add user to socket room
        }
    });

    /*user sends a message to a room*/
    socket.on('sendMsg', (data) => {
        /*get the user's current room
          socket.rooms[1] can be used because a new socket is created on join*/
        let room = Object.keys(socket.rooms)[1];
        let userId = (socket.id + "").slice(2,7);
        if(rooms[room] != undefined){
            for(var i in rooms[room].users){
                /*checking if the user exists solves a weird bug where it would
                  send to undefined users sometimes.
                  This bug is caused by disconnecting users not being removed
                  from the list of users in a given room.
                */
                if(SOCKETS[rooms[room].users[i]] != undefined){
                    /*send to all users in the sender's room*/
                    SOCKETS[rooms[room].users[i]].emit('newMsg', {id: userId, msg: data});
                } else {
                    /*"error handling" for the above mentioned bug.*/
                    console.log("user doesn't exist!!");
                }
            }
        }
    });

    socket.on('disconnect', () => {
        /*remove the socket from the list, but NOT the room.*/
        delete SOCKETS[socket.id];
    })
});


/*Setup the chatroom for users to join*/
function createChat(chatID){
    rooms[chatID] = {};
    rooms[chatID].users = [];
}
