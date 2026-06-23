const WebSocket = require("ws");

console.log("=== SERVER VERSION TEST ===");
// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

console.log("Robot simulator started on ws://localhost:8080");

// New client connection
wss.on("connection", (ws) => {
    console.log("Interface connected");

    // Notify the interface that the robot is online
    ws.send("Robot connected");

    // Receive a destination from the interface
    ws.on("message", (message) => {
        const destination = message.toString();

        console.log(`Destination received: ${destination}`);

        // Send robot status updates
        console.log("Sending: Mission received");
        ws.send("Mission received");

        setTimeout(() => {
            console.log("Sending: Robot started");
            ws.send("Robot started");
        }, 1000);

        setTimeout(() => {
            console.log("Sending: Robot moving");
            ws.send("Robot moving");
        }, 3000);

        setTimeout(() => {
            console.log("Sending: Robot arrived");
            ws.send("Robot arrived");
        }, 6000);
    });

    // Client disconnected
    ws.on("close", () => {
        console.log("Interface disconnected");
    });

    // Error handling
    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
});