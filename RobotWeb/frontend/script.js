function hello() {
    alert("Hello!");
}

function sendDestination() {
    const destination = document.getElementById("destination").value;

    socket.send(destination);

    console.log("Destination envoyée :", destination);
}

async function login() {
    console.log("Login button clicked");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        console.log("HTTP status:", response.status);

        const data = await response.json();
        console.log("Server response:", data);

        if (data.success) {
            console.log("Redirecting...");
            window.location.href = "index.html";
        } else {
            document.getElementById("message").textContent = data.message;
        }

    } catch (err) {
        console.error("Fetch error:", err);
    }
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


