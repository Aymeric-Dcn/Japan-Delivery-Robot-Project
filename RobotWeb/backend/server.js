const cors = require("cors");
const path = require("path");
const sessions = {};
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const db = require("./database"); // ton fichier SQLite
const ros = require("./ros");

const app = express();
app.use(cors({
    origin: "*" // Allows any device on your Wi-Fi to send requests
}));
app.use(express.json());

// --- DEBUG BLOCK ---
const frontendPath = path.join(__dirname, "../frontend");
console.log("-------------------------------------------------");
console.log("EXPRESS IS LOOKING FOR HTML FILES IN:");
console.log(frontendPath);
console.log("-------------------------------------------------");

app.use(express.static(frontendPath));

// A simple test page to prove the server is alive
app.get("/test", (req, res) => {
    res.send("Hello! The server is alive and the network works!");
});
// -------------------

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ===========================
// ROS INITIALIZATION
// ===========================

ros.initROS((status) => {

    console.log("[ROS -> WEB]", status);

    // Broadcast the status to every connected client
    wss.clients.forEach(client => {

        if (client.readyState === WebSocket.OPEN) {

            client.send(JSON.stringify({
                type: "status",
                message: status
            }));

        }

    });

});

server.listen(8080, "0.0.0.0", () => {
    console.log("Server listening on all network interfaces (0.0.0.0:8080)");
    console.log("Robot simulator started on ws://localhost:8080");
});


// ===========================
// LOGIN
// ===========================

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {

            if (err) {
                return res.status(500).json({ success: false });
            }

            if (!user || user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            // create session token
            const token = Date.now().toString() + Math.random();

            sessions[token] = {
                username: user.username
            };

            res.json({
                success: true,
                token
            });
        }
    );
});


// ===========================
// WEBSOCKET ROBOT
// ===========================

wss.on("connection", (ws) => {

    console.log("Interface connected");

    ws.send(JSON.stringify({
        type: "status",
        message: "Robot connected"
    }));

    ws.on("message", (message) => {

        let data;

        // =========================
        // PARSE JSON
        // =========================
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.log("Invalid message (not JSON):", message.toString());

            ws.send(JSON.stringify({
                type: "error",
                message: "Invalid format, expected JSON"
            }));

            return;
        }

        console.log("Received:", data);

        // =========================
        // MISSION (ARUCO ID)
        // =========================
        if (data.type === "mission") {

            console.log("Mission received, ArUco ID:", data.arucoId);

            console.log("Mission received, ArUco ID:", data.arucoId);

            // Publish to ROS
            ros.publishMission(String(data.arucoId));
        }

        // =========================
        // UNLOCK COMMAND
        // =========================
        else if (data.type === "unlock") {

            console.log("Unlock command received");

            ws.send(JSON.stringify({
                type: "status",
                message: "Unlock received"
            }));

            // ici plus tard:
            // → trigger ROS / ESP / relay
        }

        // =========================
        // UNKNOWN COMMAND
        // =========================
        else {

            console.log("Unknown command:", data);

            ws.send(JSON.stringify({
                type: "error",
                message: "Unknown command type"
            }));
        }
    });

    ws.on("close", () => {
        console.log("Interface disconnected");
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
});