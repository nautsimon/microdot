const express = require("express");
const app = express();

const io = require('socket.io');

/*
  === WEBSERVER CONFIG ===
*/

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.listen('8080', () => {
    console.log("Listening on port 8080");
});


/*
  === SOCKET.IO ===
*/

