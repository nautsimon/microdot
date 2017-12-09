var joinMain   = document.getElementById('joinMain');
var createMain = document.getElementById('createMain');



joinMain.onsubmit = function(e){
    console.log("gay");
    e.preventDefault();
    window.location = window.location + "chat/" + document.getElementById('joinForm').value;
}

createMain.onsubmit = function(e){
    console.log("hm");
    e.preventDefault();
    window.location = window.location + "createChat/" + document.getElementById('createForm').value;
}
