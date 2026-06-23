const cors = require("cors");
const sessions = {};
const express = require("express");
const http = require("http");
const WebSocket = require("./node_modules/ws");

const db = require("./database"); // ton fichier SQLite

const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5500"
}));
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
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

            ws.send(JSON.stringify({
                type: "status",
                message: "Mission received"
            }));

            setTimeout(() => {
                ws.send(JSON.stringify({
                    type: "status",
                    message: "Robot started"
                }));
            }, 1000);

            setTimeout(() => {
                ws.send(JSON.stringify({
                    type: "status",
                    message: "Robot moving"
                }));
            }, 3000);

            setTimeout(() => {
                ws.send(JSON.stringify({
                    type: "status",
                    message: "Robot arrived"
                }));
            }, 6000);
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