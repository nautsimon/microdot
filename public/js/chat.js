var socket = io();

// get required DOM elements
var form     = document.getElementById('chatForm'); 
var messages = document.getElementById('chatText'); // list of messages
var input    = document.getElementById('chatInput');

/*
  === Socket Setup ===
*/

socket.on('connect', () => {
    socket.emit("joinRoom", window.location.pathname.slice(6));
});

// when the user sends a message
chatForm.onsubmit = function(e){
    e.preventDefault(); // stop the page from refreshing on enter
    
    
    socket.emit('sendMsg', input.value); // send the message to the serverlf
    input.value = ''; // reset the input box.
    
}


/*
  === Socket listening ===
*/

socket.on('newMsg', function(data){
    // create the message
    formattedMessage = data.id + " | " + data.msg;
    // add a message
    messages.innerHTML += "<div class=\"message\">" + formattedMessage + "</div>";

    messages.scrollTop = messages.scrollHeight; // autoscroll
});
