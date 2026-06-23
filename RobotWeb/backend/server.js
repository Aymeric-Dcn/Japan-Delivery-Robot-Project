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

    ws.send("Robot connected");

    ws.on("message", (message) => {

        const destination = message.toString();

        console.log("Destination:", destination);

        ws.send("Mission received");

        setTimeout(() => {
            ws.send("Robot started");
        }, 1000);

        setTimeout(() => {
            ws.send("Robot moving");
        }, 3000);

        setTimeout(() => {
            ws.send("Robot arrived");
        }, 6000);

    });

    ws.on("close", () => {
        console.log("Interface disconnected");
    });

    ws.on("error", (err) => {
        console.error(err);
    });

});