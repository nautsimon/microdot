var joinMain   = document.getElementById('joinMain');
var createMain = document.getElementById('createMain');



joinMain.onsubmit = function(e){
    console.log("gay");
    e.preventDefault();
    window.location = window.location + "chat/" + 
}

createMain.onsubmit = function(e){
    e.preventDefault();
    window.location = window.location + "createChat/" + document.getElementById('joinForm').value;
}
