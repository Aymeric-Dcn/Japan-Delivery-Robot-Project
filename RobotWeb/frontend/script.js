function hello() {
    alert("Hello!");
}

function sendDestination() {

    const destination = document.getElementById("destination").value;

    if (!socket || socket.readyState !== 1) {
        console.log("WebSocket not ready");
        return;
    }

    socket.send(destination);

    console.log("Mission sent:", destination);

    document.getElementById("status").innerText =
        "Mission sent: " + destination;
}

async function login() {

    console.log("Login clicked");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    console.log("Status:", response.status);

    const text = await response.text();
    console.log("Raw response:", text);

    const data = JSON.parse(text);

    console.log("Parsed:", data);

    if (data.success) {
        window.location.href = "menu.html";
    } else {
        document.getElementById("message").textContent = data.message;
    }
}

function unlockRobot() {

    if (!socket || socket.readyState !== 1) {
        console.log("WebSocket not ready");
        return;
    }

    socket.send("UNLOCK");

    console.log("Unlock sent");

    document.getElementById("status").innerText =
        "Unlock command sent";
}

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Connecté");
};

socket.onmessage = (event) => {
    document.getElementById("message").textContent = event.data;
};

socket.onclose = () => {
    console.log("Déconnecté");
};


