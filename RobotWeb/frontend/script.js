function hello() {
    alert("Hello!");
}

function sendDestination() {
    let destination = document.getElementById("destination").value;

    alert("Destination: " + destination);
}

function login(){

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if(username==="admin" && password==="robot"){

        window.location.href = "index.html";
        document.getElementById("message").innerHTML =
            "Connexion réussie";

    }

    else{

        document.getElementById("message").innerHTML =
            "Identifiants incorrects";

    }

}

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Connecté");
};

socket.onmessage = (event) => {
    console.log("Robot :", event.data);
};

socket.onclose = () => {
    console.log("Déconnecté");
};


