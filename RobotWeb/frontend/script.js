// ======================================
// Authentication check
// ======================================

const currentPage = window.location.pathname.split("/").pop();

if (currentPage !== "login.html") {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

    }

}

function hello() {
    alert("Hello!");
}

function sendDestination() {

    const destination = document.getElementById("destination").value;

    socket.send(JSON.stringify({
        type: "mission",
        arucoId: Number(destination)
    }));

    console.log("Mission sent:", destination);
}

async function login() {

    console.log("Login clicked");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("fullname", data.user.fullname);
        window.location.href = "menu.html";
    } else {
        document.getElementById("message").textContent = data.message;
    }
}

function unlockRobot() {

    socket.send(JSON.stringify({
        type: "unlock"
    }));

    console.log("Unlock sent");
}

const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
    console.log("Connecté");
};

socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    console.log("Type:", data.type);
    console.log("Message:", data.message);
};

socket.onclose = () => {
    console.log("Déconnecté");
};

window.onload = () => {
    const receiver = document.getElementById("receiver");

    if (receiver) {
        loadUsers();
    }
};
async function loadUsers(){

    const res = await fetch("/users");

    const users = await res.json();

    const receiver = document.getElementById("receiver");

    receiver.innerHTML = "";

    users.forEach(user=>{

        if(user.id===1) return;

        receiver.innerHTML += `

            <option value="${user.id}">

                ${user.fullname}

            </option>

        `;

    });

}

async function sendDelivery(){

    const pickup = Number(document.getElementById("pickup").value);

    const destination = Number(document.getElementById("destination").value);

    const receiverId = Number(document.getElementById("receiver").value);

    const senderId = Number(localStorage.getItem("userId"));

    const res = await fetch("/delivery", {

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            senderId,

            receiverId,

            pickup,

            destination

        })

    });

    const result = await res.json();

    console.log(result);

}

async function loadDeliveries() {

    console.log("loadDeliveries called");

    const receiverId = localStorage.getItem("userId");

    const res = await fetch(

        `/my-deliveries?receiverId=${receiverId}`

    );

    console.log("HTTP status:", res.status);
    const deliveries = await res.json();

    const container = document.getElementById("deliveries");

    container.innerHTML = "";

    deliveries.forEach(delivery => {

    const unlockEnabled = canUnlock(delivery);

    container.innerHTML += `

        <div class="card">

            <h3>Delivery #${delivery.id}</h3>

            <p><b>From:</b> ${delivery.sender_name}</p>

            <p><b>Pickup:</b> ${delivery.pickup}</p>

            <p><b>Destination:</b> ${delivery.destination}</p>

            <p><b>Status:</b> ${delivery.status}</p>

            <button
                onclick="unlockDelivery(${delivery.id})"
                ${unlockEnabled ? "" : "disabled"}>
                Unlock
            </button>

        </div>

    `;

    });
    console.log("script.js loaded");

}

if (document.getElementById("deliveries")) {

    loadDeliveries();

}

function unlockDelivery(deliveryId) {

    socket.send(JSON.stringify({

        type: "unlock",
        deliveryId

    }));

    console.log("Unlock requested:", deliveryId);


}


function canUnlock(delivery) {

    return true;
    

}