const cors = require("cors");
const sessions = {};
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const db = require("./database");
const ros = require("./ros");

const app = express();

const path = require("path");

app.use(cors());

app.use(cors());

app.use(express.json());

// =====================================
// Frontend
// =====================================

const FRONTEND_PATH = path.join(__dirname, "../frontend");

console.log("==========================================");
console.log(" Japan Delivery Robot - Backend");
console.log("==========================================");
console.log("Backend folder :", __dirname);
console.log("Frontend folder:", FRONTEND_PATH);

app.use(express.static(FRONTEND_PATH));

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
    console.log("Server running on port 8080");
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
                token,
                user: {
                        id: user.id,
                        username: user.username,
                        fullname: user.fullname
                    }
                });
        }
    );
});

// ===========================
// CREATE DELIVERY
// ===========================

app.post("/delivery", (req, res) => {

    const { senderId, receiverId, pickup, destination } = req.body;

    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO deliveries
        (sender_id, receiver_id, pickup, destination, status, created_at)

        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            senderId,
            receiverId,
            pickup,
            destination,
            "CREATED",
            createdAt
        ],

        function(err){

            if(err){

                console.error(err);

                return res.status(500).json({
                    success:false
                });

            }

            ros.publishMission({

            pickup,

            destination

            });

            res.json({

                success:true,

                deliveryId:this.lastID

            });

        }

    );

});

// ===========================
// USERS
// ===========================

app.get("/users", (req, res) => {

    db.all(
        "SELECT id, fullname FROM users",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json([]);
            }

            res.json(rows);
        }
    );

});


// ===========================
// DELIVERIES
// ===========================

app.get("/my-deliveries", (req, res) => {

    const receiverId = Number(req.query.receiverId);

    db.all(

        `SELECT
            deliveries.*,
            users.fullname AS sender_name

         FROM deliveries

         JOIN users
         ON deliveries.sender_id = users.id

         WHERE receiver_id = ?

         ORDER BY id DESC`,

        [receiverId],

        (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json([]);

            }

            res.json(rows);

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
            //ros.publishMission(String(data.arucoId));
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