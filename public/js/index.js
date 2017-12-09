var socket = io();

var form     = document.getElementById('chatForm'); 
var messages = document.getElementById('chatText'); // list of messages
var input    = document.getElementById('chatInput');


chatForm.onsubmit = function(e){
    e.preventDefault(); // stop the page from refreshing on enter
    
    
    socket.emit('sendMsg', input.value); // send the message to the serverlf
    input.value = ''; // reset the input box.
    
}


/*
  === Socket listening ===
*/

socket.on('newMsg', function(data){
    addMessage(data.msg);
    formattedMessage = data.id + " | " + data.msg;
    messages.innerHTML += "<div class=\"message\">" + formattedMessage + "</div>";
});



/*
 === Misc. functions ===
*/

function addMessage(message){
    console.log(message);

}
